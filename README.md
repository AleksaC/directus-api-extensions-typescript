# Directus hook typescript example

**Update:** This was created before `v9.0.0` of directus which changed the way
extensions are registered. The code here may still work on new versions, but
I'll still try to update it if I have time.

[Directus](https://directus.io/) is a good choice if you need to provide a simple
CRUD dashboard for your project without having to build one yourself or shoehorning
a CMS on top of the existing database.

Directus provides a lot of the stuff out of the box, and it can be configured
through the ui and environment variables. In addition to that it can be further
customized  by using [extensions](https://docs.directus.io/extensions/introduction/).
Currently directus doesn't support building hooks in typescript. In addition to
that you have to manually restart directus server in order to see the changes
you made to the exension.

This repository provides a webpack config that bundles extensions built in
typescript and puts the outputs where directs would expect them to be and
restarts the server after emitting the bundle. Only hooks example is available
at the moment, but other extension types should be easily supported with a few
tweaks to the webpack config and I might add them later.

## Getting started
The easiest way to run this example is by using `docker-compose`. Run the
following command to get the example up and running:

```shell
git clone git@github.com:AleksaC/directus-api-extensions-typescript.git
cd directus-api-extensions-typescript
cp example/.env.example example/.env
./bootstrap.sh
```

## Contact 🙋‍♂️

-   [Personal website](https://aleksac.me)
-   <a target="_blank" href="http://twitter.com/aleksa_c_"><img alt='Twitter followers' src="https://img.shields.io/twitter/follow/aleksa_c_.svg?style=social"></a>
-   aleksacukovic1@gmail.com
