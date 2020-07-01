# EricksMagicalLabelGenerator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.3.

## How to run:
server: run `npm run start:server`
client: run `ng serve`

## how to Deploy to AWS
### Server
1. zip backend folder contents
2. in AWS Elastic Beanstalk, find ericks-magical-label-generator application
3. click into it and click 'Update and deploy', add zip file, incrememt version

### Client
1. run `ng build --prod` to make new version of app which will be located in the 'dist' folder
2. in AWS S3 find ericks-magical-label-generator bucket
3. select and delete all contents
4. upload 'dist' folder contents (at the moment 'assets' folder is not needed, as it only contains notes.txt)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
