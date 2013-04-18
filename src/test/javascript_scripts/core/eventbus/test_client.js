/*
 * Copyright 2011-2012 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

load('test_utils.js')
load('vertx.js')

var tu = new TestUtils();

// Most testing occurs in the Java tests

var eb = vertx.eventBus;
var address = 'foo-address';

var sent = {
  price : 23.45,
  name : 'tim'
};

var emptySent = {
  address : address
};

var reply = {
  desc: "approved",
  status: 123
}

function assertSent(msg) {
  tu.azzert(sent.price === msg.price);
  tu.azzert(sent.name === msg.name);
}


function assertReply(rep) {
  tu.azzert(reply.desc === rep.desc);
  tu.azzert(reply.status === rep.status);
}

function testSimple() {

  var handled = false;
  var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
    tu.checkThread();
    tu.azzert(!handled);
    assertSent(msg);
    eb.unregisterHandler(address, MyHandler);
    handled = true;
    tu.testComplete();
  });
  tu.azzert(ebus === eb)

  tu.azzert(eb.send(address, sent) === eb);
}

function testEmptyMessage() {

  var handled = false;
  var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
    tu.checkThread();
    tu.azzert(!handled);
    tu.azzert(eb.unregisterHandler(address, MyHandler) === eb);
    handled = true;
    tu.testComplete();
  });
  tu.azzert(ebus === eb);
  tu.azzert(eb.send(address, emptySent) === eb);
}


function testUnregister() {

  var handled = false;
  var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
    tu.checkThread();
    tu.azzert(!handled);
    assertSent(msg);
    tu.azzert(eb.unregisterHandler(address, MyHandler) === eb);
    // Unregister again - should do nothing
    tu.azzert(eb.unregisterHandler(address, MyHandler) === eb);
    handled = true;
    // Wait a little while to allow any other messages to arrive
    vertx.setTimer(100, function() {
      tu.testComplete();
    })
  });

  for (var i = 0; i < 2; i++) {
    tu.azzert(eb.send(address, sent) === eb);
  }
}

function testWithReply() {

  var handled = false;
  var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
    tu.checkThread();
    tu.azzert(!handled);
    assertSent(msg);
    tu.azzert(eb.unregisterHandler(address, MyHandler) === eb);
    handled = true;
    replier(reply);
  });
  tu.azzert(ebus === eb);

  ebus = eb.send(address, sent, function(reply) {
    tu.checkThread();
    assertReply(reply);
    tu.testComplete();
  });
  tu.azzert(ebus === eb);
}

function testReplyOfReplyOfReply() {

  var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
    tu.azzert("message" === msg);
    replier("reply", function(reply, replier) {
      tu.azzert("reply-of-reply" === reply);
      replier("reply-of-reply-of-reply");
      tu.azzert(eb.unregisterHandler(address, MyHandler) === eb);
    });
  });
  tu.azzert(ebus === eb);

  ebus = eb.send(address, "message", function(reply, replier) {
    tu.azzert("reply" === reply);
    replier("reply-of-reply", function(reply) {
      tu.azzert("reply-of-reply-of-reply" === reply);
      tu.testComplete();
    });
  });
  tu.azzert(ebus === eb);
}

function testEmptyReply() {

  var handled = false;
  var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
    tu.checkThread();
    tu.azzert(!handled);
    assertSent(msg);
    tu.azzert(eb.unregisterHandler(address, MyHandler) === eb);
    handled = true;
    replier({});
  });
  tu.azzert(ebus === eb);

 ebus = eb.send(address, sent, function(reply) {
    tu.checkThread();
    tu.testComplete();
  });
  tu.azzert(ebus === eb);

  tu.azzert(eb.send(address, sent) === eb);
}

function testEchoString() {
  echo("foo");
}

function testEchoNumber1() {
  echo(1234);
}

function testEchoNumber2() {
  echo(1.2345);
}

function testEchoBooleanTrue() {
  echo(true);
}

function testEchoBooleanFalse() {
  echo(false);
}

function testEchoJson() {
  echo(sent);
}

function testEchoBuffer() {
  echo(new org.vertx.java.core.buffer.Buffer);
}

function testEchoNull() {
  echo(null);
}

function echo(msg) {
  var ebus = eb.registerHandler(address, function MyHandler(received, replier) {
    tu.checkThread();
    tu.azzert(eb.unregisterHandler(address, MyHandler) === eb);
    replier(received);
  });
  tu.azzert(ebus === eb);
  ebus = eb.send(address, msg, function (reply){

    if (msg != null) {
      if (typeof msg != 'object') {
        tu.azzert(msg === reply);
      } else {
        //Json object
        for (field in reply) {
          tu.azzert(msg.field === reply.field);
        }
      }
    } else {
      tu.azzert(reply == null);
    }

    tu.testComplete();
  });
  tu.azzert(ebus === eb);
}

tu.registerTests(this);
tu.appReady();

function vertxStop() {
  tu.unregisterAll();
  tu.appStopped();
}