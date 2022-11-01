# How Scopes works

So scopes are defined on the database level, but the authentication parameters (available once a user is signed in to a scope), are made available everywhere.

```sql
DEFINE SCOPE account SESSION 24h
  SIGNUP ( CREATE user SET email = $email, pass = crypto::argon2::generate($pass) )
  SIGNIN ( SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass) )
;
```

Then you can use the authentication variables in TABLE / FIELD permissions...

```sql
DEFINE FIELD account ON TABLE note
  PERMISSIONS
    FOR create, update, select, delete
      WHERE account = $auth.account -- The user can only access/modify notes, if the account matches the account they belong to
;
```

With **1.0.0-beta.8** with the new $token variables that you know about...

```sql
DEFINE SCOPE account;
DEFINE TOKEN my_token ON SCOPE account TYPE HS512 VALUE "my_secret_encryption_key";
```

Then we could generate a JWT with the following information...

```json
{
  "iss": "Auth0",
  "account": "account:ajd82kvn48vl2m3",
  "exp": 1516239022,
  "NS": "my_ns",
  "DB": "my_db",
  "SC": "account",
  "TK": "my_token",
  "ID": "user:10fnvk20r8vn20eiv"
}
```

Then you can use the token or the auth variable in permissions clauses...

```sql
DEFINE FIELD account ON TABLE note
  PERMISSIONS
    FOR create, update, select, delete
      WHERE account = $token.account -- Where the account field of the JWT (which is a record id) matches the account field of the document
      OR account = $auth.account -- Where the account field of the logged in user (taken from the ID field on the JWT) matches the account field of the document
;
```

To answer your second question, it's flexible as to how you use scopes. You could have a 'permissions' object on each user account which specifies what a user could do, and then you could check that on each of the permissions clauses, or you could segregate different user types (admins / users) into separate scopes.

In our recruitment CRM product we use 2 scopes...

1. account - for people logging in to the system as a user of the CRM
2. contact - for people logging on to the system who can only see+manage their own data (as an applicant)

A permissions clause of the 'contact' table looks like this...

```sql
DEFINE TABLE contact SCHEMAFULL
  PERMISSIONS
    FOR select
        WHERE ($scope = "account" AND account = $account AND (SELECT * FROM $auth.access WHERE account = $account AND (admin = true OR permissions.crm ∋ "s") LIMIT 1))
        OR ($scope = "contact" AND id = $auth.id)
        OR ($scope = "contact" AND distinct(applications.*.campaign.*.connections.*.contact) ∋ $auth.id)
        OR ($scope = "contact" AND distinct(connections.*.campaign.*.connections.*.contact) ∋ $auth.id)
    FOR create
        WHERE ($scope = "account" AND account = $account AND (SELECT * FROM $auth.access WHERE account = $account AND (admin = true OR permissions.crm ∋ "c") LIMIT 1))
    FOR update
        WHERE ($scope = "account" AND account = $account AND (SELECT * FROM $auth.access WHERE account = $account AND (admin = true OR permissions.crm ∋ "u") LIMIT 1))
        OR ($scope = "contact" AND id = $auth.id)
        OR ($scope = "contact" AND distinct(applications.*.campaign.*.connections.*.contact) ∋ $auth.id)
    FOR delete
        WHERE ($scope = "account" AND account = $account AND (SELECT * FROM $auth.access WHERE account = $account AND (admin = true OR permissions.crm ∋ "d") LIMIT 1))
```

Source: [Discord](https://discord.com/channels/902568124350599239/1025048139968815194/1025055707952844863)
