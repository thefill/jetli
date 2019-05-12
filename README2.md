[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6129bd9a22f043a09e9cd89141d60176) ](https://www.codacy.com/app/fifofil/jetli?utm_source=github.com&utm_medium=referral&utm_content=thefill/jetli&utm_campaign=Badge_Grade) [ ![Greenkeeper badge](https://badges.greenkeeper.io/thefill/jetli.svg) ](https://greenkeeper.io/) [ ![CricleCi badge](https://circleci.com/gh/thefill/jetli/tree/master.svg?style=shield) ](https://circleci.com/gh/thefill/jetli) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

# Jetli

Simple, light dependency injector - supports factories, classes and primitives.

## Main features:

*   tiny & easy to use: only 2 methods
*   delayed dependency initialisation
*   No peer dependencies
*   Typescript types included
*   exposes esm/cjs modules
*   always 100% test coverage

## Guide

*   [Installation](#installation "Installation")
*   [Basic usage](#basic-usage "Basic usage")
*   [Advanced usage](#advanced-usage "Advanced usage")
*   [Documentation](#documentation "Documentation")

## Installation

<pre>        npm install --save jetli
    </pre>

or

<pre>        yarn add jetli
    </pre>

or

<pre>        pnpm --save jetli
    </pre>

## Usage (basic)

Jetli allows you to inject consistently classes, functions and primitives across whole application.

### Inject & instantiate class via 'get' method

<pre class="runkit-container">        const jetli = require('jetli@0.0.2');

        class Attack {
            constructor(){
                this.id = Math.round();
                console.log(`Attack no. ${this.id} ready!`);
            }
            punch(){
                console.log(`Attack no. ${this.id} executed!`);
            }
        }

        const fighter1 = jetli.get(Attack);
        const fighter2 = jetli.get(Attack);

        fighter1.punch();
        fighter2.punch();
    </pre>

### Inject & instantiate class via 'set' and retrieve instance via 'get' methods

<pre class="runkit-container">        const jetli = require('jetli@0.0.2');

        class Attack {
            constructor(){
                this.id = Math.round();
                console.log(`Attack no. ${this.id} ready!`);
            }
            punch(){
                console.log(`Attack no. ${this.id} executed!`);
            }
        }
        jetli.set(Attack);

        const fighter1 = jetli.get(Attack);
        const fighter2 = jetli.get(Attack);

        fighter1.punch();
        fighter2.punch();
    </pre>

### Inject & instantiate class via 'set' method and unique id & retrieve instance via 'get' methods

<pre class="runkit-container">        const jetli = require('jetli@0.0.2');

        class Attack {
            constructor(){
                this.id = Math.round();
                console.log(`Attack no. ${this.id} ready!`);
            }
            punch(){
                console.log(`Attack no. ${this.id} executed!`);
            }
        }
        jetli.set('fighter', Attack);

        const fighter1 = jetli.get('fighter');
        const fighter2 = jetli.get('fighter');

        fighter1.punch();
        fighter2.punch();
    </pre>

### Inject primitives via id

<pre class="runkit-container">        const jetli = require('jetli@0.0.2');

        const someNumber = 123;
        const someString = 'punch';
        const someArray = [123, 'punch'];

        jetli.set('number', someNumber);
        jetli.set('string', someString);
        jetli.set('array', someArray);

        const injectedNumber = jetli.get('number');
        console.log(injectedNumber);

        const injectedString = jetli.get('string');
        console.log(injectedString);

        const injectedArray = jetli.get('array');
        console.log(injectedArray);

    </pre>

### Create initialisation-friendly services

<pre class="runkit-container">        const jetli = require('jetli@0.0.2');

        jetli.set('someNumber', 123);

        class JetliFriendlyService {
            init(jetli){
                this.id = jetli.get('someNumber');
                console.log(`Attack no. ${this.id} ready!`);
            }

            punch(){
                console.log(`Attack no. ${this.id} executed!`);
            }
        }

        const fighter1 = jetli.get(JetliFriendlyService);
        const fighter2 = jetli.get(JetliFriendlyService);

        fighter1.punch();
        fighter2.punch();
    </pre>

## Usage (Advanced)

### Pass arguments to services constructor

### Inject services into other services without circular dependency

### Delay initialisation of services until used (injection request)

### Swap services for specific classes

### Mock services for test purposes

## Documentation

You can find full documentation [here](todo)
