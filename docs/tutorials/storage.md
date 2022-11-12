# Database storing settings

It really depends on how you run the database.

If you are using the cli and run the database via surreal start, the database runs in-memory per default. So the the data is not stored persistently anywhere.

You can manually provide a path to determine where the data is stored.

```bash
surreal start file://./surrealDB
```

Valid values for `path` are

- memory to store the data in-memory
- `file://<path>` to store the data in the specified path
- `tikv://<addr>` to store the data in a TiKV database
