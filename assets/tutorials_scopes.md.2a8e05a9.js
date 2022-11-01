import{_ as s,c as a,o as n,d as o}from"./app.040e86db.js";const i=JSON.parse('{"title":"How Scopes works","description":"","frontmatter":{},"headers":[],"relativePath":"tutorials/scopes.md","lastUpdated":1667334123000}'),p={name:"tutorials/scopes.md"},l=o(`<h1 id="how-scopes-works" tabindex="-1">How Scopes works <a class="header-anchor" href="#how-scopes-works" aria-hidden="true">#</a></h1><p>So scopes are defined on the database level, but the authentication parameters (available once a user is signed in to a scope), are made available everywhere.</p><div class="language-sql"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">DEFINE SCOPE account </span><span style="color:#F78C6C;">SESSION</span><span style="color:#A6ACCD;"> 24h</span></span>
<span class="line"><span style="color:#A6ACCD;">  SIGNUP ( </span><span style="color:#F78C6C;">CREATE</span><span style="color:#A6ACCD;"> user </span><span style="color:#F78C6C;">SET</span><span style="color:#A6ACCD;"> email </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $email, pass </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> crypto::argon2::generate($pass) )</span></span>
<span class="line"><span style="color:#A6ACCD;">  SIGNIN ( </span><span style="color:#F78C6C;">SELECT</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">FROM</span><span style="color:#A6ACCD;"> user </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> email </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $email </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> crypto::argon2::compare(pass, $pass) )</span></span>
<span class="line"><span style="color:#A6ACCD;">;</span></span>
<span class="line"></span></code></pre></div><p>Then you can use the authentication variables in TABLE / FIELD permissions...</p><div class="language-sql"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">DEFINE FIELD account </span><span style="color:#F78C6C;">ON</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">TABLE</span><span style="color:#A6ACCD;"> note</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">PERMISSIONS</span></span>
<span class="line"><span style="color:#A6ACCD;">    FOR </span><span style="color:#F78C6C;">create</span><span style="color:#A6ACCD;">, </span><span style="color:#F78C6C;">update</span><span style="color:#A6ACCD;">, </span><span style="color:#F78C6C;">select</span><span style="color:#A6ACCD;">, </span><span style="color:#F78C6C;">delete</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $auth.account </span><span style="color:#676E95;">-- The user can only access/modify notes, if the account matches the account they belong to</span></span>
<span class="line"><span style="color:#A6ACCD;">;</span></span>
<span class="line"></span></code></pre></div><p>With <strong>1.0.0-beta.8</strong> with the new $token variables that you know about...</p><div class="language-sql"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">DEFINE SCOPE account;</span></span>
<span class="line"><span style="color:#A6ACCD;">DEFINE TOKEN my_token </span><span style="color:#F78C6C;">ON</span><span style="color:#A6ACCD;"> SCOPE account </span><span style="color:#F78C6C;">TYPE</span><span style="color:#A6ACCD;"> HS512 </span><span style="color:#F78C6C;">VALUE</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">my_secret_encryption_key</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">;</span></span>
<span class="line"></span></code></pre></div><p>Then we could generate a JWT with the following information...</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">iss</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Auth0</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">account</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">account:ajd82kvn48vl2m3</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">exp</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1516239022</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">NS</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">my_ns</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">DB</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">my_db</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">SC</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">account</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">TK</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">my_token</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">ID</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">user:10fnvk20r8vn20eiv</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>Then you can use the token or the auth variable in permissions clauses...</p><div class="language-sql"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">DEFINE FIELD account </span><span style="color:#F78C6C;">ON</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">TABLE</span><span style="color:#A6ACCD;"> note</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">PERMISSIONS</span></span>
<span class="line"><span style="color:#A6ACCD;">    FOR </span><span style="color:#F78C6C;">create</span><span style="color:#A6ACCD;">, </span><span style="color:#F78C6C;">update</span><span style="color:#A6ACCD;">, </span><span style="color:#F78C6C;">select</span><span style="color:#A6ACCD;">, </span><span style="color:#F78C6C;">delete</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $token.account </span><span style="color:#676E95;">-- Where the account field of the JWT (which is a record id) matches the account field of the document</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F78C6C;">OR</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $auth.account </span><span style="color:#676E95;">-- Where the account field of the logged in user (taken from the ID field on the JWT) matches the account field of the document</span></span>
<span class="line"><span style="color:#A6ACCD;">;</span></span>
<span class="line"></span></code></pre></div><p>To answer your second question, it&#39;s flexible as to how you use scopes. You could have a &#39;permissions&#39; object on each user account which specifies what a user could do, and then you could check that on each of the permissions clauses, or you could segregate different user types (admins / users) into separate scopes.</p><p>In our recruitment CRM product we use 2 scopes...</p><ol><li>account - for people logging in to the system as a user of the CRM</li><li>contact - for people logging on to the system who can only see+manage their own data (as an applicant)</li></ol><p>A permissions clause of the &#39;contact&#39; table looks like this...</p><div class="language-sql"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">DEFINE </span><span style="color:#F78C6C;">TABLE</span><span style="color:#A6ACCD;"> contact SCHEMAFULL</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">PERMISSIONS</span></span>
<span class="line"><span style="color:#A6ACCD;">    FOR </span><span style="color:#F78C6C;">select</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> ($scope </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">account</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $account </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> (</span><span style="color:#F78C6C;">SELECT</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">FROM</span><span style="color:#A6ACCD;"> $auth.access </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $account </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> (</span><span style="color:#F78C6C;">admin</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> true </span><span style="color:#F78C6C;">OR</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">permissions</span><span style="color:#A6ACCD;">.crm \u220B </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">s</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">) </span><span style="color:#F78C6C;">LIMIT</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">))</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">OR</span><span style="color:#A6ACCD;"> ($scope </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">contact</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> id </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $auth.id)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">OR</span><span style="color:#A6ACCD;"> ($scope </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">contact</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">distinct</span><span style="color:#A6ACCD;">(applications.</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">.campaign.</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">.connections.</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">.contact) \u220B $auth.id)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">OR</span><span style="color:#A6ACCD;"> ($scope </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">contact</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">distinct</span><span style="color:#A6ACCD;">(connections.</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">.campaign.</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">.connections.</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">.contact) \u220B $auth.id)</span></span>
<span class="line"><span style="color:#A6ACCD;">    FOR </span><span style="color:#F78C6C;">create</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> ($scope </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">account</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $account </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> (</span><span style="color:#F78C6C;">SELECT</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">FROM</span><span style="color:#A6ACCD;"> $auth.access </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $account </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> (</span><span style="color:#F78C6C;">admin</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> true </span><span style="color:#F78C6C;">OR</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">permissions</span><span style="color:#A6ACCD;">.crm \u220B </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">c</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">) </span><span style="color:#F78C6C;">LIMIT</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">))</span></span>
<span class="line"><span style="color:#A6ACCD;">    FOR </span><span style="color:#F78C6C;">update</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> ($scope </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">account</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $account </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> (</span><span style="color:#F78C6C;">SELECT</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">FROM</span><span style="color:#A6ACCD;"> $auth.access </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $account </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> (</span><span style="color:#F78C6C;">admin</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> true </span><span style="color:#F78C6C;">OR</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">permissions</span><span style="color:#A6ACCD;">.crm \u220B </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">u</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">) </span><span style="color:#F78C6C;">LIMIT</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">))</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">OR</span><span style="color:#A6ACCD;"> ($scope </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">contact</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> id </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $auth.id)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">OR</span><span style="color:#A6ACCD;"> ($scope </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">contact</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">distinct</span><span style="color:#A6ACCD;">(applications.</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">.campaign.</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">.connections.</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">.contact) \u220B $auth.id)</span></span>
<span class="line"><span style="color:#A6ACCD;">    FOR </span><span style="color:#F78C6C;">delete</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> ($scope </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">account</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $account </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> (</span><span style="color:#F78C6C;">SELECT</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">FROM</span><span style="color:#A6ACCD;"> $auth.access </span><span style="color:#F78C6C;">WHERE</span><span style="color:#A6ACCD;"> account </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> $account </span><span style="color:#F78C6C;">AND</span><span style="color:#A6ACCD;"> (</span><span style="color:#F78C6C;">admin</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> true </span><span style="color:#F78C6C;">OR</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">permissions</span><span style="color:#A6ACCD;">.crm \u220B </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">d</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">) </span><span style="color:#F78C6C;">LIMIT</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">))</span></span>
<span class="line"></span></code></pre></div><p>Source: <a href="https://discord.com/channels/902568124350599239/1025048139968815194/1025055707952844863" target="_blank" rel="noreferrer">Discord</a></p>`,17),e=[l];function t(c,C,r,D,y,A){return n(),a("div",null,e)}const u=s(p,[["render",t]]);export{i as __pageData,u as default};