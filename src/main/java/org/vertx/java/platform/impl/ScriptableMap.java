package org.vertx.java.platform.impl;

import org.mozilla.javascript.Scriptable;

import java.util.Map;

/*
 * Copyright 2013 Red Hat, Inc.
 *
 * Red Hat licenses this file to you under the Apache License, version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * @author <a href="http://tfox.org">Tim Fox</a>
 */
public class ScriptableMap implements Scriptable {

  private final Map map;

  public ScriptableMap(Map map) {
    this.map = map;
  }

  @Override
  public String getClassName() {
    return getClass().getName();
  }

  @Override
  public Object get(String name, Scriptable start) {
    return map.get(name);
  }

  @Override
  public Object get(int index, Scriptable start) {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean has(String name, Scriptable start) {
    return map.containsKey(name);
  }

  @Override
  public boolean has(int index, Scriptable start) {
    throw new UnsupportedOperationException();
  }

  @Override
  public void put(String name, Scriptable start, Object value) {
    map.put(name, value);
  }

  @Override
  public void put(int index, Scriptable start, Object value) {
    throw new UnsupportedOperationException();
  }

  @Override
  public void delete(String name) {
    throw new UnsupportedOperationException();
  }

  @Override
  public void delete(int index) {
    throw new UnsupportedOperationException();
  }

  @Override
  public Scriptable getPrototype() {
    return null;
  }

  @Override
  public void setPrototype(Scriptable prototype) {
  }

  @Override
  public Scriptable getParentScope() {
    return null;
  }

  @Override
  public void setParentScope(Scriptable parent) {
  }

  @Override
  public Object[] getIds() {
    Object[] ids = new Object[map.size()];
    int i = 0;
    for (Object key: map.keySet()) {
      ids[i++] = key;
    }
    return ids;
  }

  @Override
  public Object getDefaultValue(Class<?> hint) {
    return null;
  }

  @Override
  public boolean hasInstance(Scriptable instance) {
    return instance instanceof ScriptableMap;
  }
}
