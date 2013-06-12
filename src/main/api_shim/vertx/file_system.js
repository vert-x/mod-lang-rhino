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

if (typeof __vertxload === 'string') {
  throw "Use require() to load the Vert.x API"
}

var jfs = __jvertx.fileSystem();

/**
 * Represents the file-system and contains a broad set of operations for manipulating files.
 * An asynchronous and a synchronous version of each operation is provided.
 * The asynchronous versions take a handler as a final argument which is
 * called when the operation completes or an error occurs. The handler is called
 * with two arguments; the first an exception, this will be nil if the operation has
 * succeeded. The second is the result - this will be nil if the operation failed or
 * there was no result to return.
 * The synchronous versions return the results, or throw exceptions directly.
 * @type {{}}
 */
var fileSystem = {};

load("vertx/read_stream.js");
load("vertx/write_stream.js");

function wrapHandler(handler) {
  return function(asyncResult) {
    if (asyncResult.succeeded()) {
      handler(null, asyncResult.result());
    } else {
      handler(asyncResult.cause(), null);
    }
  }
}

function wrapPropsHandler(handler) {
  return function(asyncResult) {
    if (asyncResult.succeeded()) {
      var jsProps = convertProps(asyncResult.result());
      handler(null, jsProps);
    } else {
      handler(asyncResult.cause(), null);
    }
  }
}

function convertProps(j_props) {
  return {
    creationTime: j_props.creationTime().getTime(),
    lastAccessTime: j_props.lastAccessTime().getTime(),
    lastModifiedTime: j_props.lastModifiedTime().getTime(),
    isDirectory: j_props.isDirectory(),
    isOther: j_props.isOther(),
    isRegularFile: j_props.isRegularFile(),
    isSymbolicLink: j_props.isSymbolicLink(),
    size: j_props.size()
  }
}

/**
 * Copy a file, asynchronously. The copy will fail if from does not exist, or if to already exists.
 *
 * @param from path of file to copy
 * @param to path of file to copy to
 * @param arg2 recursive
 * @param arg3 the handler which is called on completion.
 * @returns {{}}
 */
fileSystem.copy = function(from, to, arg2, arg3) {
  var handler;
  var recursive;
  if (arguments.length === 4) {
    handler = arg3;
    recursive = arg2;
  } else {
    handler = arg2;
    recursive = false;
  }
  jfs.copy(from, to, recursive, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of copy
 *
 * @param from
 * @param to
 * @param recursive
 * @returns {{}}
 */
fileSystem.copySync = function(from, to, recursive) {
  if (!recursive) recursive = false;
  jfs.copySync(from, to, recursive);
  return fileSystem;
}

/**
 * Move a file, asynchronously. The move will fail if from does not exist, or if to already exists.
 *
 * @param from Path of file to move
 * @param to Path of file to move to
 * @param handler the function to call when complete
 * @returns {{}}
 */
fileSystem.move = function(from, to, handler) {
  jfs.move(from, to, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of move.
 *
 * @param from
 * @param to
 * @returns {{}}
 */
fileSystem.moveSync = function(from, to) {
  jfs.moveSync(from, to);
  return fileSystem;
}

/**
 * Truncate a file, asynchronously. The move will fail if path does not exist.
 *
 * @param path: Path of file to truncate
 * @param len: Length to truncate file to. Will fail if len < 0. If len > file size then will do nothing.
 * @param handler: the function to call when complete
 * @returns {{}}
 */
fileSystem.truncate = function(path, len, handler) {
  jfs.truncate(path, len, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of truncate.
 *
 * @param path
 * @param len
 * @returns {{}}
 */
fileSystem.truncateSync = function(path, len) {
  jfs.truncateSync(path, len);
  return fileSystem;
}

/**
 * Change the permissions on a file, asynchronously. If the file is directory then all contents will also have their permissions changed recursively.
 *
 * @param path: path of file to change permissions
 * @param perms: a permission string of the form rwxr-x--- as specified in http://download.oracle.com/javase/7/docs/api/java/nio/file/attribute/PosixFilePermissions.html. This is
 * used to set the permissions for any regular files (not directories).
 * @param arg2
 * @param arg3
 * @returns {{}}
 */
fileSystem.chmod = function(path, perms, arg2, arg3) {
  var handler;
  var dirPerms;
  if (arguments.length === 4) {
    handler = arg3;
    dirPerms = arg2;
  } else {
    handler = arg2;
    dirPerms = null;
  }
  jfs.chmod(path, perms, dirPerms, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of chmod.
 *
 * @param path
 * @param perms
 * @param dirPerms
 * @returns {{}}
 */
fileSystem.chmodSync = function(path, perms, dirPerms) {
  if (!dirPerms) dirPerms = null;
  jfs.chmodSync(path, perms, dirPerms);
  return fileSystem;
}

/**
 * Get file properties for a file, asynchronously.
 *
 * @param path path to file
 * @param handler the function to call when complete
 * @returns {{}}
 */
fileSystem.props = function(path, handler) {
  jfs.props(path, wrapPropsHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of props.
 * @param path
 * @returns {*}
 */
fileSystem.propsSync = function(path) {
  var j_props = jfs.propsSync(path);
  return convertProps(j_props);
}

/**
 * Obtain properties for the link represented by {@code path}, asynchronously.
 * The link will not be followed..
 *
 * @param path: path to file
 * @param handler: the function to call when complete
 * @returns {{}}
 */
fileSystem.lprops = function(path, handler) {
  jfs.lprops(path, wrapPropsHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of lprops.
 *
 * @param path
 * @returns {*}
 */
fileSystem.lpropsSync = function(path) {
  var j_props = jfs.lpropsSync(path);
  return convertProps(j_props);
}

/**
 * Create a hard link, asynchronously..
 *
 * @param link: path of the link to create.
 * @param existing: path of where the link points to.
 * @param handler: the function to call when complete
 * @returns {{}}
 */
fileSystem.link = function(link, existing, handler) {
  jfs.link(link, existing, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of link.
 * @param link
 * @param existing
 * @returns {{}}
 */
fileSystem.linkSync = function(link, existing) {
  jfs.linkSync(link, existing);
  return fileSystem;
}

/**
 * Create a symbolic link, asynchronously.
 *
 * @param link: Path of the link to create.
 * @param existing: Path of where the link points to.
 * @param handler: the function to call when complete
 * @returns {{}}
 */
fileSystem.symlink = function(link, existing, handler) {
  jfs.symlink(link, existing, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of symlink.
 * @param link
 * @param existing
 * @returns {{}}
 */
fileSystem.symlinkSync = function(link, existing) {
  jfs.symlinkSync(link, existing);
  return fileSystem;
}

/**
 * Unlink a hard link.
 *
 * @param link path of the link to unlink.
 * @param handler the handler to notify on completition.
 * @returns {{}}
 */
fileSystem.unlink = function(link, handler) {
  jfs.unlink(link, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of unlink.
 *
 * @param link
 * @returns {{}}
 */
fileSystem.unlinkSync = function(link) {
  jfs.unlinkSync(link);
  return fileSystem;
}

/**
 * Read a symbolic link, asynchronously. I.e. tells you where the symbolic link points.
 *
 * @param link path of the link to read.
 * @param handler the function to call when complete
 * @returns {{}}
 */
fileSystem.readSymlink = function(link, handler) {
  jfs.readSymlink(link, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of readSymlink.
 *
 * @param link
 * @param handler
 * @returns {*}
 */
fileSystem.readSymlinkSync = function(link, handler) {
  return jfs.readSymlinkSync(link);
}

/**
 * Delete a file on the file system, asynchronously.
 * The delete will fail if the file does not exist, or is a directory and is not empty.
 *
 * @param path path of the file to delete.
 * @param arg1
 * @param arg2
 * @returns {{}}
 */
fileSystem.delete = function(path, arg1, arg2) {
  var handler;
  var recursive;
  if (arguments.length === 3) {
    handler = arg2;
    recursive = arg1;
  } else {
    handler = arg1;
    recursive = false;
  }
  jfs.delete(path, recursive, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of delete.
 *
 * @param path
 * @param recursive
 * @returns {{}}
 */
fileSystem.deleteSync = function(path, recursive) {
  if (!recursive) recursive = false;
  jfs.deleteSync(path, recursive);
  return fileSystem;
}

/**
 * reate a directory, asynchronously.
 * The create will fail if the directory already exists, or if it contains parent directories which do not already
 * exist.
 *
 * @param path path of the directory to create.
 * @param arg1
 * @param arg2
 * @param arg3
 * @returns {{}}
 */
fileSystem.mkDir = function(path, arg1, arg2, arg3) {
  var createParents;
  var perms;
  var handler;
  switch (arguments.length) {
    case 2:
      createParents = false;
      perms = null;
      handler = arg1;
      break;
    case 3:
      if (typeof(arg1) === 'boolean') {
        createParents = arg1;
        perms=null;
      } else {
        createParents = false;
        perms = arg1;
      }
      handler = arg2;
      break;
    case 4:
      createParents = arg1;
      perms = arg2;
      handler = arg3;
      break;
    default:
      throw 'Invalid number of arguments';
  }
  jfs.mkdir(path, perms, createParents, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of mkdir.
 *
 * @param path
 * @param arg1
 * @param arg2
 * @returns {{}}
 */
fileSystem.mkDirSync = function(path, arg1, arg2) {
  var createParents;
  var perms;
  switch (arguments.length) {
    case 1:
      createParents = false;
      perms = null;
      break;
    case 2:
      createParents = arg1;
      perms = null;
      break;
    case 3:
      createParents = arg1;
      perms = arg2;
      break;
    default:
      throw 'Invalid number of arguments';
  }
  jfs.mkdirSync(path, perms, createParents);
  return fileSystem;
}

/**
 * Read a directory, i.e. list it's contents, asynchronously.
 * The read will fail if the directory does not exist.
 *
 * @param path path of the directory to read.
 * @param arg1
 * @param arg2
 * @returns {{}}
 */
fileSystem.readDir = function(path, arg1, arg2) {
  var filter;
  var handler;
  if (arguments.length === 3) {
    handler = arg2;
    filter = arg1;
  } else {
    handler = arg1;
    filter = null;
  }
  jfs.readDir(path, filter, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of readDir.
 *
 * @param path
 * @param filter
 * @returns {*}
 */
fileSystem.readDirSync = function(path, filter) {
  if (!filter) filter = false;
  return jfs.readDirSync(path, filter);
}

/**
 * Read the conet of the entire file.
 *
 * @param path: path of the file to read.
 * @param handler: the function to call when complete
 * @returns {{}}
 */
fileSystem.readFile = function(path, handler) {
  jfs.readFile(path, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of readFile.
 *
 * @param path
 * @returns {*}
 */
fileSystem.readFileSync = function(path) {
  return jfs.readFileSync(path);
}

/**
 * Write data to a file
 *
 * @param path path of the file to write.
 * @param data the data to write
 * @param handler the function to call when complete
 * @returns {{}}
 */
fileSystem.writeFile = function(path, data, handler) {
  if (typeof data === 'string') {
    data = new org.vertx.java.core.buffer.Buffer(data);
  }
  jfs.writeFile(path, data, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of writeFile.
 *
 * @param path
 * @param data
 * @returns {{}}
 */
fileSystem.writeFileSync = function(path, data) {
  if (typeof data === 'string') {
    data = new org.vertx.java.core.buffer.Buffer(data);
  }
  jfs.writeFileSync(path, data);
  return fileSystem;
}

fileSystem.OPEN_READ = 1;
fileSystem.OPEN_WRITE = 2;
fileSystem.CREATE_NEW = 4;

/**
 * Synchronous version of open.
 *
 * @param path
 * @param arg1
 * @param arg2
 * @param arg3
 * @returns {*}
 */
fileSystem.openSync = function(path, arg1, arg2, arg3) {
  // TODO combine this code with the similar code in open
  var openFlags;
  var flush;
  var perms;
  var handler;
  switch (arguments.length) {
    case 1:
      openFlags = fileSystem.OPEN_READ | fileSystem.OPEN_WRITE
                | fileSystem.CREATE_NEW;
      flush = false;
      perms = null;
      break;
    case 2:
      openFlags = arg1;
      flush = false;
      perms = null;
      break;
    case 3:
      openFlags = arg1;
      flush = arg2;
      perms = null;
      break;
    case 4:
      openFlags = arg1;
      flush = arg2;
      perms = arg3;
      break;
    default:
      throw 'Invalid number of arguments';
  }

  var read = (openFlags & fileSystem.OPEN_READ) == fileSystem.OPEN_READ;
  var write = (openFlags & fileSystem.OPEN_WRITE) == fileSystem.OPEN_WRITE;
  var createNew = (openFlags & fileSystem.CREATE_NEW) == fileSystem.CREATE_NEW;

  var asyncFile = jfs.openSync(path, perms, read, write, createNew, flush);

  return wrapAsyncFile(asyncFile);
}

/**
 * Open a file on the file system, asynchronously.
 *
 * @param path: path of the file to open.
 *
 * @param path
 * @param arg1
 * @param arg2
 * @param arg3
 * @param arg4
 * @returns {{}}
 */
fileSystem.open = function(path, arg1, arg2, arg3, arg4) {

  var openFlags;
  var flush;
  var perms;
  var handler;
  switch (arguments.length) {
    case 2:
      openFlags = fileSystem.OPEN_READ | fileSystem.OPEN_WRITE
                | fileSystem.CREATE_NEW;
      flush = false;
      perms = null;
      handler = arg1;
      break;
    case 3:
      openFlags = arg1;
      flush = false;
      perms = null;
        handler = arg2;
      break;
    case 4:
      openFlags = arg1;
      flush = arg2;
      perms = null;
      handler = arg3;
      break;
    case 5:
      openFlags = arg1;
      flush = arg2;
      perms = arg3;
      handler = arg4;
      break;
    default:
      throw 'Invalid number of arguments';
  }

  var read = (openFlags & fileSystem.OPEN_READ) == fileSystem.OPEN_READ;
  var write = (openFlags & fileSystem.OPEN_WRITE) == fileSystem.OPEN_WRITE;
  var createNew = (openFlags & fileSystem.CREATE_NEW) == fileSystem.CREATE_NEW;

  jfs.open(path, perms, read, write, createNew, flush, function(asyncResult) {
    if (asyncResult.succeeded()) {
      var jaf = asyncResult.result();
      var wrapped = wrapAsyncFile(jaf);
      handler(null, wrapped);
    } else {
      handler(asyncResult.cause(), null);
    }
  });
  return fileSystem;
}

function wrapAsyncFile(jaf) {
  var asf = {
    close: function(handler) {
      if (handler) {
        jaf.close(wrapHandler(handler))
      } else {
        jaf.close();
      }
    },

    write: function(buffer, position, handler) {
      jaf.write(buffer, position, wrapHandler(handler));
      return asf;
    },

    read: function(buffer, offset, position, length, handler) {
      jaf.read(buffer, offset, position, length, wrapHandler(handler));
      return asf;
    },

    flush: function(handler) {
      if (handler) {
        jaf.flush(wrapHandler(handler));
      } else {
        jaf.flush();
      }
    }
  };
  writeStream(asf, jaf);
  readStream(asf, jaf);
  return asf;
}

/**
 * Create a new empty file, asynchronously.
 *
 * @param path path of the file to create.
 * @param handler the function to call when complete
 * @returns {{}}
 */
fileSystem.createFile = function(path, handler) {
  jfs.createFile(path, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of createFile.
 *
 * @param path
 * @returns {{}}
 */
fileSystem.createFileSync = function(path) {
  jfs.createFileSync(path);
  return fileSystem;
}

/**
 * Check if a file exists, asynchronously.
 *
 * @param path Path of the file to check.
 * @param handler the function to call when complete
 * @returns {{}}
 */
fileSystem.exists = function(path, handler) {
  jfs.exists(path, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of exists.
 *
 * @param path
 * @returns {*}
 */
fileSystem.existsSync = function(path) {
  return jfs.existsSync(path);
}

/**
 * Get properties for the file system, asynchronously.
 *
 * @param path Path in the file system.
 * @param handler the function to call when complete
 * @returns {{}}
 */
fileSystem.fsProps = function(path, handler) {
  jfs.fsProps(path, wrapHandler(handler));
  return fileSystem;
}

/**
 * Synchronous version of fsProps.
 */
fileSystem.fsPropsSync = function(path) {
  return jfs.fsPropsSync(path);
}

module.exports = fileSystem;
