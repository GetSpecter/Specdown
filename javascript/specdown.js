/* specdown : github.com/getspecter/specdown */

/*
The MIT License (MIT)

Copyright (c) 2014 Benjamin Vacha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.  
*/

/*
 * 
*/
var specdown = {
    
    /*
     * specify behavior
    */
    config: {
        strict: false
    },
    
    /*
     * translate markdown to markup
    */
    markup: {
        
        // markdownId: required string
        // markupId: optional string
        // previewId: optional string
        live: function(markdownId, markupId, previewId) {
            var markdownElement = document.getElementById(markdownId),
                markupElement = document.getElementById(markupId),
                previewElement = document.getElementById(previewId),
                liveCache = '',
                liveIteration = function() {
                    liveCache = specdown.markup.all(markdownElement.value);
                    if(markupElement) markupElement.value = liveCache;
                    if(previewElement) previewElement.innerHTML = liveCache;
                };
            if(markdownElement) {
                if(markdownElement.addEventListener) {
                    markdownElement.addEventListener('input', liveIteration, false);
                } else if(markdownElement.attachEvent) {
                    markdownElement.attachEvent('onpropertychange', liveIteration);
                }
                liveIteration();
            }
        },
        
        // markdown: required string
        all: function(markdown) {
            markdown = specdown.markup.escapedChars(markdown);
            return markdown;
        },
        
        // escaped non whitespace or alphanumeric chars -> ascii html encoding
        escapedChars: function(markdown) {
            return markdown.replace(/\\([^A-Za-z0-9\s])/g, function(match, escapedChar) {
                return '&#' + escapedChar.charCodeAt() + ';';
            });
        }
        
    },
    
    /*
     * translate markup to markdown
    */
    markdown: {
        
        // markupId: required string
        // markdownId: optional string
        // previewId: optional string
        live: function(markupId, markdownId, previewId) {
            var markupElement = document.getElementById(markupId),
                markdownElement = document.getElementById(markdownId),
                previewElement = document.getElementById(previewId),
                liveCache = '',
                liveIteration = function() {
                    liveCache = specdown.markdown.all(markupElement.value);
                    if(markdownElement) markdownElement.value = liveCache;
                    if(previewElement) previewElement.innerHTML = liveCache;
                };
            if(markupElement) {
                if(markupElement.addEventListener) {
                    markupElement.addEventListener('input', liveIteration, false);
                } else if(markupElement.attachEvent) {
                    markupElement.attachEvent('onpropertychange', liveIteration);
                }
                liveIteration();
            }
        },
        
        // markup: required string
        all: function(markup) {
            return markup;
        }
        
    }
    
};

/*
 * node.js module definition
*/
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = specdown;
}
