# (┛❍ᴥ❍)┛彡┻━┻ Bazooka RCS

Bazooka RCS (Remote Content Shooter) compiles your working directory of
markdown files to a remote server. This means that you keep your changes local
and not on a server. This means that attackers won't be able to do malicious
stuff to your site. Great! Seriously though, doing changes on a live production
server just seems dirty and wrong. Don't you agree?

This is done in Node. Yes, you guess it, you will need Node and NPM installed
on the machine you want the project to live in. Begin by running:

```
npm install get-bazooka --global
```

Cool! Now we have the BAZOOKA!! Watch out internet (´⊙◞⊱◟⊙｀)

## How does it work?

> Huh? So you are just transfering files from my local to a remote server?

Kinda, but it's a little bit more fancy. Bazooka will read through all your
markdown files and convert it into HTML. It will then store it into a JSON file
but maintaining the structure you set out in your project folder.

For example if you had a project with the following folders and no markdown
files:

```
my-awesome-project
	|_ homepage
	|_ about
		|_ who we are
```

_Will result in._

```json
{
	"homepage": {},
	"about": {
		"who we are": {}
	}
}
```

## Let's get cracking!

Let's setup our bazooka so we are ready to get started with firing away at our
target.

Create a folder with the name of your project and `cd` into folder like so:

```
$ mkdir my-awesome-project
$ cd my-awesome-project
```

Remember guys this is a CLI tool, 'cause we are super l33t h@xors ʅ（‾◡◝）ʃ
(you might want to wear your cringe glasses).

(　ﾟｪﾟ) "Soo much cheese..."

Run the command:

```
bazooka init
```

Then follow the prompts. You should then see a hidden config file called
`.bazookaConfig` with something like this inside:

```json
{
    "host": "192.168.33.10",
    "port": 22,
    "location": "/var/www/public/",
    "excludeDirs": []
}
```
### Brief details on the snippet above

**host** As you might have guessed, this where you put in the remote server.

**port** 22 is SSH, but you can put in a different port number but it must be
SSH or SFTP. It might be smarter and safer to use SFTP ( ･ิω･ิ)

**location** This is the location on the remote server you wish to put your
exports out to.

**excludeDirs** Sometimes you just want to have some directories excluded from
being exported.

```
"excludeDirs": [
	'naughty_files",
	"selfies"
]
```

**Bazooka init will also create a folder called `public` this is where you put
any assets you want to be sent to the remote server.**

So now that we have our bazooka, we need some ammo.

Let's create a markdown file.

```
$ mkdir home
$ touch home/index.md
```

In our markdown file we start by adding in metadata and then write the body
contents. Yes, it's like adding in YAML data (-＿- )ノ

```markdown
---
title: My Home Page
is_awesome: true
---

# Welcome to my awesome website!

It is so awesome it has some text. ʅ（ ‾⊖◝）ʃ
```

Now, let's fire this baby up!

```
$ bazooka fire
```

Enter in your login details and voila!

It will export the following:

```json
{
    "home": {
        "index": {
            "title": "My Home Page",
            "is_awesome": true,
            "content": "<h1 id=\"welcome-to-my-awesome-website-\">Welcome to my awesome website!</h1>\n<p>It is so awesome it has some text. ʅ（ ‾⊖◝）ʃ</p>\n"
        }
    }
}
```

Great job! You're done (◕‿◕✿)
