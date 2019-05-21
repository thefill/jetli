[//]: # (Readme partial used by an default readme page)

## Main features

*   tiny & easy to use: only 3 methods
*   delayed dependency initialisation
*   No peer dependencies
*   Typescript types included
*   exposes esm/cjs modules
*   always 100% test coverage

## Guide

*   [Installation](#installation "Installation")
*   [Basic usage](#basicusage "Basic usage")
*   [Advanced usage](#advancedusage "Advanced usage")
*   [API documentation](#documentation "Documentation")

## Installation

<pre>npm install --save jetli</pre>

or

<pre>yarn add jetli</pre>

or

<pre>pnpm --save jetli</pre>

## Basic usage

Jetli allows you to inject consistently classes, functions and primitives across whole application.

### Inject & instantiate class via 'get' method

Injecting instances of classes is trivial with jetli - just use 'get' method without any additional options.

<pre class="runkit-source">const jetli = require('jetli@0.0.8').jetli;

class Attack {
    constructor(){
        this.id = Math.round(Math.random() * 100);
        console.log(`Attack no. ${this.id} ready!`);
    }
    punch(){
        console.log(`Attack no. ${this.id} executed!`);
    }
}

const fighter1 = jetli.get(Attack);
const fighter2 = jetli.get(Attack);

fighter1.punch();
fighter2.punch();</pre>

### Inject & instantiate class via 'set' and retrieve instance via 'get' methods

Functions, already instantiated objects or primitive values like array, string and numbers can be injected via 'get' method priory to registering them with jetli. 

Registration is provided via 'set' method and requires you to provide string token that identifies the injectable element.

<pre class="runkit-source">const jetli = require('jetli@0.0.8').jetli;

class Attack {
    constructor(){
        this.id = Math.round(Math.random() * 100);
        console.log(`Attack no. ${this.id} ready!`);
    }
    punch(){
        console.log(`Attack no. ${this.id} executed!`);
    }
}
jetli.set('attack', Attack);

const fighter1 = jetli.get('attack');
const fighter2 = jetli.get('attack');

fighter1.punch();
fighter2.punch();</pre>

### Inject primitives via id

As explained in previous example primitives can be easily used across your applications with associated string id provided during registration.

<pre class="runkit-source">const jetli = require('jetli@0.0.8').jetli;

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
console.log(injectedArray);</pre>

### Create initialisation-friendly services

To use Jetli to full extend implement services that expose init method. This method is the safest place to use Jelit injector inside injectable services.

<pre class="runkit-source">const jetli = require('jetli@0.0.8').jetli;

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
fighter2.punch();</pre>

## Advanced usage

### Delay initialisation of services until used (on injection request)

Have enough of overhead when all those services initialises at once? Register them and request initialisation only when injection is requested.

<pre class="runkit-source">const jetli = require('jetli@0.0.8').jetli;

class Attack {
    constructor(){
        this.id = Math.round(Math.random() * 100);
        console.log(`Attack no. ${this.id} ready!`);
    }
    punch(){
        console.log(`Attack no. ${this.id} executed!`);
    }
}

jetli.set('attack', Attack, false);
console.log('No initialisation at this point');

const fighter1 = jetli.get('attack');
const fighter2 = jetli.get('attack');

fighter1.punch();
fighter2.punch();</pre>

### Pass arguments to services constructor

<pre class="runkit-source">const jetli = require('jetli@0.0.8').jetli;

class Attack {
    constructor(id){
        this.id = id;
        console.log(`Attack no. ${this.id} ready!`);
    }
    punch(){
        console.log(`Attack no. ${this.id} executed!`);
    }
}
const externalId = Math.round(Math.random() * 100);
jetli.set('attack', Attack, false, externalId);

const fighter1 = jetli.get('attack');
const fighter2 = jetli.get('attack');

fighter1.punch();
fighter2.punch();</pre>

### Inject services into other services without circular dependency

Jetli uses battle-tested method to fight 'cyclic dependencies' - optional initialisation callback. Injector searches for optional init method to call it and as an argument to provide instance of injector itself. This method provide safe moment to inject all dependencies required by service - you can be sure that all dependencies will be already initialised.

<pre class="runkit-source">const jetli = require('jetli@0.0.8').jetli;

class ServiceA {
    init(jetli){
        this.service = jetli.get(ServiceB);
        this.id = this.service.getNumber();
    }

    getNumber(){
        return 123;
    }

    getId(){
        return this.id;
    }
}

class ServiceB {
    init(jetli){
        this.service = jetli.get(ServiceA);
        this.id = this.service.getNumber();
    }

    getNumber(){
        return 456;
    }

    getId(){
        return this.id;
    }
}

const serviceA = jetli.get(ServiceA);
const serviceB = jetli.get(ServiceB);

serviceA.getId();
serviceB.getId();</pre>

### Mock services for test purposes

Its rather trivial to mock module dependencies if you have total control whats injected where, right? ith Jetli you can reset any previously registered/injected dependencies and introduce your own mocks / stubs.

<pre class="runkit-source">const jetli = require('jetli@0.0.8').jetli;

class Attack {
    constructor(){
        this.id = Math.round(Math.random() * 100);
        console.log(`Attack no. ${this.id} ready!`);
    }
    punch(){
        console.log(`Attack no. ${this.id} executed!`);
    }
}

class AttackMock {
    constructor(){
        super();
        console.log(`Attack mocked!`);
    }
    punch(){
        super.punch();
        console.log(`Mocked attack execution!`);
    }
}

// somewhere in your code
jetli.set('attack', Attack);

const fighter1 = jetli.get('attack');
fighter1.punch();

// somewhere in your test
jetli.unset('attack');
jetli.set('attack', AttackMock);

const fighter2 = jetli.get('attack');
fighter2.punch();</pre>
