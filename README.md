# loc8r
## Example application from Getting MEAN with Mongo, Express, Angular and Node by Simon Holmes

**(*Nota bene*: While I was doing a rebase to edit some old commits, the
project history got messed up for reasons I don't really fathom. As only the
most recent commit really matters and as I'm not sure any efforts I make to
rectify the situation won't backfire, I'm going to leave this be for now. Any
anomalies seen in the history should be assumed to be a product of the
rebase.)**

Earlier I was deploying this to Heroku. But the problem is that the Heroku
add-on that supports MongoDB, mLab, uses MongoDB 3.x. The version that's
supported on 32-bit Ubuntu is 2.x. These two can't talk to each other.
Additionally, my attempt to compile MongoDB on a 32-bit platform failed, which
makes sense because MongoDB's development team have mentioned that they intend
to cease any support for 32-bit systems at all. DDD: So I had to stop using
Heroku.

Fortunately this app can be run by cloning it. But first MongoDB has to be set up.
Follow my
[instructions](https://github.com/readyready15728/misc/blob/master/mongodb-authorization.md)
on how to set up an administrative user on MongoDB. Then, while still in the
Mongo shell, carry out the following commands:

```
use loc8r
db.createUser({user: 'loc8r', pwd: 'yourPassword', roles: ["readWrite", "dbAdmin"]});
```

The password you have chosen needs to be included in the file `.env` in the
project root, like so:

```
MONGODB_PASSWORD=yourPassword
```

Then restore the contents of the database, which have been provided here in
directory `mongodump`. The restoration process goes like so, if you followed my
earlier instructions:

```bash
mongorestore -h localhost -d loc8r -u admin -p --authenticationDatabase admin mongodump/
```

Now that the MongoDB database has been restored, there is one other thing that
needs to be done, which is adding another variable to the aforementioned `.env`
file that contains the password for the database user, another password of
sorts for use by the jsonwebtoken module. The line will look something like
this:

```
JWT_SECRET=jsonwebtokenPassword
```

After all of this is said and done, the next step is doing `npm install` to
install all the Node.js modules. It should then be possible to start the app by
doing `npm start` in the root directory.

As for accessing the site: as of this writing, I am on the final chapter of the
book, which concerns user authentication. I wanted to run the application
through HTTPS. I created the directory `keys` in the project and, in it, I
carried out the following commands before altering the script `bin/www` to use
an encrypted connection:

```bash
openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
openssl x509 -req -days 36500 -in csr.pem -signkey key.pem -out server.crt
```

Accordingly, the (self-signed) certificate should be good for about one hundred
years. (By 2118 or so, I expect that anything related to JavaScript will have
long since faded away into total obsolescence.) Again, because the certificate
is self-signed, it is necessary to store an exception in your browser. There is
no cause for concern. Last but not least, the site can *only* be accessed
through `https://localhost:3000`. The `https://` part *has* to be there.

There is one other snag. The application developed in the book features
geolocation. The locations in the database are all in the United Kingdom. I
have decided to keep things that way rather than broadcast where I live on
here. In `public/angularjs/loc8r.js`, in the function `locationListCtrl`, it
should very obvious how I intentionally crippled geolocation and how to turn it
back on again. If you do this, of course, you will most likely have to change
the database, unless you live within 25 km of 51.3° N 0.79° W. I'll leave that
as an exercise for the reader.

I might consider trying to host this on Digital Ocean or AWS or something in
the future but right now that isn't a priority.
