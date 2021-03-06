# generator-spring-boot-application-from-swagger
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Yeoman spring boot mvc application generator from swagger api specification

# Work in progress

- [x] Generate RestControllers
- [x] Generate RestControllers specs
- [x] Generate RestControllers integration specs
- [x] Generate model classes (pojos) in `api` module
- [x] Generate gradlew wrapper
- [x] Generate simple application.yml
- [x] Generate Application.java spring boot starter
- [x] More tests for generator code (coverage)
- [x] Migrate to yeoman-generator 1.x.x
- [x] Switch to es6
- [x] Yeoman options support
- [ ] Kotlin support (poc)
- [ ] Added (base) swagger support (by io.springfox)
- [ ] Swagger documentation support for generated code (@ApiModel, @ApiOperation)
- [ ] Ask for spring boot version
- [ ] Add metrics support (@Timed)
- [ ] Split generator to more actions

## Installation

First, install [Yeoman](http://yeoman.io) and generator-spring-boot-application-from-swagger using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

Using yarn (recommended):

```bash
$ yarn global add yo
$ yarn global add generator-spring-boot-application-from-swagger
```

Using npm:

```bash
$ npm install -g yo
$ npm install -g generator-spring-boot-application-from-swagger
```

## Usage

```bash
$ yo spring-boot-application-from-swagger --help

Usage:
  yo spring-boot-application-from-swagger:app [options]

Options:
  -h,   --help                     # Print the generator's options and usage
        --skip-cache               # Do not remember prompt answers                        Default: false
        --skip-install             # Do not automatically install dependencies             Default: false
        --use-cli-defaults         # Use default values if not provided (will not prompt)
        --run-gradle-build         # Run build gradle on generated project
        --base-package-name        # Enter default base package name:                      Default: com.mobulum
        --base-name                # Enter base name of app:                               Default: app
        --controller-class-suffix  # Enter controller class suffix:                        Default: Controller
        --api-path                 # Path (or URL) to swagger document:                    Default: https://raw.githubusercontent.com/mobulum/example-spring-boot-application-from-swagger/master/pet-store-swagger.json
```

## Generate your (new) project

### In default (questions) mode

```bash
$ yo spring-boot-application-from-swagger

? Enter default base package name: com.mobulum
? Enter base name of app: app
? Enter controller class suffix: Controller
? Path (or URL) to swagger document: https://raw.githubusercontent.com/mobulum/example-spring-boot-application-from-swagger/master/pet-store-swagger.json
```

### Passing values to command line

```bash
$ yo spring-boot-application-from-swagger \
  --base-package-name=com.example \
  --base-name=apps \
  --controller-class-suffix=Ctrl \
  --api-path=https://raw.githubusercontent.com/mobulum/example-spring-boot-application-from-swagger/master/pet-store-swagger.json
```


## [Example](https://github.com/mobulum/example-spring-boot-application-from-swagger) of generated file structure based on defaults

```
├── api
│   ├── build.gradle
│   └── src
│       ├── integrationTest
│       │   └── groovy
│       │       └── com
│       │           └── mobulum
│       │               └── api
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── mobulum
│       │   │           └── api
│       │   │               └── model
│       │   │                   ├── Category.java
│       │   │                   ├── ErrorInfoResponse.java
│       │   │                   ├── Order.java
│       │   │                   ├── OrderStatus.java
│       │   │                   ├── Pet.java
│       │   │                   ├── PetStatus.java
│       │   │                   ├── Tag.java
│       │   │                   ├── UploadResponse.java
│       │   │                   └── User.java
│       │   └── resources
│       └── test
│           └── groovy
│               └── com
│                   └── mobulum
│                       └── api
├── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
├── service
│   ├── build.gradle
│   └── src
│       ├── integrationTest
│       │   └── groovy
│       │       └── com
│       │           └── mobulum
│       │               └── service
│       │                   ├── ApplicationIntegrationSpec.groovy
│       │                   └── rest
│       │                       └── controllers
│       │                           ├── AbstractRestControllerIntegrationSpec.groovy
│       │                           ├── V2PetControllerIntegrationSpec.groovy
│       │                           ├── V2StoreControllerIntegrationSpec.groovy
│       │                           └── V2UserControllerIntegrationSpec.groovy
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── mobulum
│       │   │           └── service
│       │   │               ├── Application.java
│       │   │               └── rest
│       │   │                   └── controllers
│       │   │                       ├── V2PetController.java
│       │   │                       ├── V2StoreController.java
│       │   │                       └── V2UserController.java
│       │   └── resources
│       │       └── application.yml
│       └── test
│           └── groovy
│               └── com
│                   └── mobulum
│                       └── service
│                           └── rest
│                               └── controllers
│                                   ├── V2PetControllerSpec.groovy
│                                   ├── V2StoreControllerSpec.groovy
│                                   └── V2UserControllerSpec.groovy
└── settings.gradle

45 directories, 31 files
```

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [mobulum.com](http://mobulum.com)


[npm-image]: https://badge.fury.io/js/generator-spring-boot-application-from-swagger.svg
[npm-url]: https://npmjs.org/package/generator-spring-boot-application-from-swagger
[travis-image]: https://travis-ci.org/mobulum/npm-yo-generator-spring-boot-application-from-swagger.svg?branch=master
[travis-url]: https://travis-ci.org/mobulum/npm-yo-generator-spring-boot-application-from-swagger
[daviddm-image]: https://david-dm.org/mobulum/npm-yo-generator-spring-boot-application-from-swagger.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/mobulum/npm-yo-generator-spring-boot-application-from-swagger
[coveralls-image]: https://coveralls.io/repos/mobulum/npm-yo-generator-spring-boot-application-from-swagger/badge.svg
[coveralls-url]: https://coveralls.io/r/mobulum/npm-yo-generator-spring-boot-application-from-swagger
