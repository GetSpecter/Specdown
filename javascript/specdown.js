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
            markdown = specdown.markup.comments(markdown);
            markdown = specdown.markup.metas(markdown);
            markdown = specdown.markup.blockquotes(markdown);
            markdown = specdown.markup.details(markdown);
            markdown = specdown.markup.lists(markdown);
            markdown = specdown.markup.tables(markdown);
            return markdown;
        },
        
        // escaped non whitespace or alphanumeric chars >> ascii html encoding
        escapedChars: function(markdown) {
            return markdown.replace(/\\([^A-Za-z0-9\s])/g, function(match, escapedChar) {
                return '&#' + escapedChar.charCodeAt() + ';';
            });
        },
        
        // pair of three or more slashes >> nothing
        // pair of three or more slashes with bang >> <!-- -->
        comments: function(markdown) {
            return markdown.replace(/(\/{3,})(?!\/)(!)?([\s\S]+?)\1(?!\/)/g, function(match, slashes, bang, content) {
                if(bang) return '<!-- ' + content + ' -->';
                return '';
            });
        },
        
        // three curly brackets >> nothing
        // three curly brackets with ! >> <!-- -->
        metas: function(markdown) {
            return markdown.replace(/\{\{\{(!)?([\s\S]*?)\}\}\}/g, function(match, bang, content) {
                if(bang) return '<!-- ' + content + ' -->';
                return '';
            });
        },
        
        // > >> blockquote
        blockquotes: function(markdown) {
            // buildTag is recursivelly called
            var maxNest = 10, 
                buildTag = function(match, ender, cite, clss, content) {
                    ender = (ender) ? '<!-- -->' : '';
                    cite = (cite) ? ' cite="' + content + '"' : '';
                    clss = (clss) ? ' class="' + clss + '"' : '';
                    // if the blockquote content contains another valid blockquote syntax, recall buildTag on it
                    // nests blockquotes inside of each other
                    if(!cite && content.search(/^\>(.*)/g) > -1) {
                        content = content.replace(/\>(\>?)(\!?)(?:\<(.*)?\>)? (.*)/g, buildTag);
                    }
                    // return the whole mess back up 
                    // main diffence between returns is to not include a newline with cite
                    if(cite) return '<blockquote' + clss + cite + '>\n</blockquote>' + ender;
                    return '<blockquote' + clss + '>\n' + content + '\n</blockquote>' + ender;
                };
            // add pad to ease regex
            markdown = '\n' + markdown + '\n';
            // find all of the first level >, optionally match first level >>, optionally match ! cite
            markdown = markdown.replace(/\n\>(\>?)(\!?)(?:\<(.*)?\>)? (.*)/g, function(match, ender, cite, clss, content) {
                return '\n' + buildTag(match, ender, cite, clss, content);
            });
            // as long as the extra (incorrect) ending and starting blockquote tags are found, remove them
            while(markdown.search(/<\/blockquote>(\s{0,1})<blockquote.*?>/g) > -1 && maxNest--) {
                markdown = markdown.replace(/\n<\/blockquote>(\s{0,1})<blockquote.*?>\n/g, '$1');
            }
            // remove pad and return
            return markdown.substring(1, markdown.length - 1);
        },
        
        // < >> details
        details: function(markdown) {
            // buildTag is recursivelly called
            var maxNest = 10, 
                buildTag = function(match, ender, summary, clss, content) {
                    ender = (ender) ? '<!-- -->' : '';
                    summary = (summary) ? '<summary>' + content + '</summary>' : '';
                    clss = (clss) ? ' class="' + clss + '"' : '';
                    // if the content contains another valid details syntax, recall buildTag on it
                    // nests details inside of each other
                    if(!summary && content.search(/^\<(.*)/g) > -1) {
                        content = content.replace(/\<(\<?)(\!?)(?:\<(.*)?\>)? (.*)/g, buildTag);
                    }
                    // return the whole mess back up
                    if(summary) return '<details' + clss + '>\n' + summary + '\n</details>' + ender;
                    return '<details' + clss + '>\n' + content + '\n</details>' + ender;
                };
            // add pad to ease regex
            markdown = '\n' + markdown + '\n';
            // find all of the first level <, optionally match first level <<, optionally match ! summary
            markdown = markdown.replace(/\n\<(\<?)(\!?)(?:\<(.*)?\>)? (.*)/g, function(match, ender, summary, clss, content) {
                return '\n' + buildTag(match, ender, summary, clss, content);
            });
            // as long as the extra (incorrect) ending and starting details tags are found, remove them
            while(markdown.search(/<\/details>(\s{0,1})<details.*?>/g) > -1 && maxNest--) {
                markdown = markdown.replace(/\n<\/details>(\s{0,1})<details.*?>\n/g, '$1');
            }
            // remove pad and return
            return markdown.substring(1, markdown.length - 1);
        },
        
        // - or + or * >> <ul></ul>
        // #. >> <ol></ol>
        // : >> <dl></dl>
        lists: function(markdown) {
            // TODO: everything
            return markdown;
        },
        
        // | | >> <table></table>
        tables: function(markdown) {
            //
            var getHeaderTags = function(content, tableClss, clss, aligns) {
                    var i = 0, align;
                    // check for table or row class
                    if(tableClss && clss) {
                        tableClss = ' class="' + clss + '"';
                        clss = '';
                    } else if(clss) {
                        tableClss = '';
                        clss = ' class="' + clss + '"';
                    } else {
                        tableClss = '';
                        clss = '';
                    }
                    // convert bars to columns
                    content = content.replace(/(?:\|)? ?([\S\t ]*?) ?\|/g, function(match, content) {
                        align = (aligns[i]) ? aligns[i] : '';
                        i++;
                        return '\n<th' + align + '>' + content + '</th>';
                    });
                    //
                    return '\n<table' + tableClss + '>\n<thead>\n<tr' + clss + '>' + content + '\n</tr>\n</thead>\n</table>';
                },
                getRowAligns = function(content) {
                    var aligns = [];
                    content = content.replace(/(?:\|)? ?(:)?([\S\t ]*?)(:)? ?\|/g, function(match, left, content, right) {
                        if(left && right) {
                            aligns.push(' align="center"');
                        } else if(left) {
                            aligns.push(' align="left"');
                        } else if(right) {
                            aligns.push(' align="right"');
                        } else {
                            aligns.push('');
                        }
                        return '';
                    });
                    return aligns;
                },
                getRowTags = function(content, clss, aligns) {
                    var i = 0, align;
                    clss = (clss) ? ' class="' + clss + '"' : '';
                    // convert bars to columns
                    content = content.replace(/(?:\|)? ?([\S\t ]*?) ?\|/g, function(match, content) {
                        align = (aligns[i]) ? aligns[i] : '';
                        i++;
                        return '\n<td' + align + '>' + content + '</td>';
                    });
                    //
                    return '\n<table>\n<tbody>\n<tr' + clss + '>' + content + '\n</tr>\n</tbody>\n</table>';
                };
            var processTable = function(match, table) {
                var aligns = [];
                // parse first row that is only dashes, bars, and colons for aligns
                table = table.replace(/\n(\|[-:\|\t ]*?\|)(\<)?(?:\<(.*)?\>)?(?=\n)/, function(match, content, tableClss, clss) {
                    aligns = getRowAligns(content);
                    return '';
                });
                // parse the first row in the table for headers
                table = table.replace(/\n(\|[\S\t ]*?\|)(\<)?(?:\<(.*)?\>)?(?=\n)/, function(match, content, tableClss, clss) {
                    return getHeaderTags(content, tableClss, clss, aligns);
                });
                // parse every other line in the table for rows
                table = table.replace(/\n(\|[\S\t ]*?\|)(\<)?(?:\<(.*)?\>)?(?=\n|$)/g, function(match, content, tableClss, clss) {
                    return getRowTags(content, clss, aligns);
                });
                //
                return table;
            };
            // add pad to ease regex
            markdown = '\n' + markdown + '\n\n';
            // find, markup an entire table
            markdown = markdown.replace(/(\n\|[\S\s]*?\|)(?=\n[\t ]*\n)/g, processTable);
            // clean up extra table and tbody tags
            markdown = markdown.replace(/\n<\/table>\n<table.*?>\n/g, '\n');
            markdown = markdown.replace(/\n<\/tbody>\n<tbody.*?>\n/g, '\n');
            // remove pad and return
            return markdown.substring(1, markdown.length - 2);
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
