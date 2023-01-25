/**
 * Copyright 2023 Bart Butenaers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function (RED) {
    const settings = RED.settings;
    const fs = require('fs');
    const path = require('path');
    const resolvePackage = require('resolve-pkg');
    const https = require('https');

    // Determine the path to the minified js file of the beautify library
    let jsBeautifyPath = resolvePackage("js-beautify", {cwd: __dirname});
    let jsBeautifyMinifiedPath = path.join(jsBeautifyPath, "js", "lib", "beautifier.min.js");

    // Determine the path to the files of the svgedit library.
    // Currently this node only uses svg-edit in the cloud, not a local version via npm (to avoid storage usage and build step)
    //let svgEditPath = resolvePackage("svgedit", {cwd: __dirname});
    //let svgEditCssPath = path.join(svgEditPath, "dist", "editor", "svgedit.css");
    //let svgEditJsPath = path.join(svgEditPath, "dist", "editor", "Editor.js");

    function SvgEditNode(config) {
        RED.nodes.createNode(this,config);
        this.svgString = config.svgString;

        var node = this;
        
        node.on("input", function(msg) {
            switch(msg.topic) {
                case "get_svg":
                    msg.payload = node.svgString;
                    break;
                default:
                    node.error("unsupported command");
                    break;
            }

            node.send(msg);
        });

        node.on("close", function () {
            node.status({});
        });
    }

    RED.nodes.registerType("svg-edit", SvgEditNode);
    
    // Make all the javascript library files available to the FLOW EDITOR.
    // No permissions are required to read these public resources.
    // Otherwise we get 'unauthorized' problems, when calling this endpoint from a 'script' tag.
    // See details on https://discourse.nodered.org/t/unauthorized-when-accessing-custom-admin-endpoint/20201/4
    RED.httpAdmin.get('/svg_edit/lib/*', function(req, res) {
        switch (req.params[0]) {
            case "beautifier.min.js":
                // Send the requested js library file to the client
                res.sendFile(jsBeautifyMinifiedPath);
                return;
            default:
                let cloudUrl = "https://svgedit.netlify.app/editor/" + req.params[0];
                
                https.get(cloudUrl, function(cloudResponse) {
                    let chunks = [];

                    cloudResponse.on('data', function(chunk) {
                        chunks.push(chunk);
                    });

                    cloudResponse.on('end', function() {
                        // The chunks are of type Uint8Array that need to be concatenated to a single Uint8Array
                        let data = Buffer.concat(chunks);
                        // Make sure the MIME type (e.g. "application/javascript") is kept intact when proxying requests
                        res.setHeader("Content-Type", cloudResponse.headers['content-type']);
                        res.writeHead(200);
                        res.end(data);
                    });
                }).on('error', function(err) {
                    res.writeHead(404);
                    return res.end("Cannot get the requested file: " + err);
                });
                return;
        }

        res.writeHead(404);
        return res.end("The requested file is not available");
    });
};