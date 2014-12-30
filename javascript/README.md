# Specdown

## JavaScript

The JavaScript implementation of Specdown.

---

### Node.js Usage

Specdown can be imported and used as a module in Node.js.

###### javascript
```
var specdown = require('pathtofile/specdown.js'),
    markdown = from_an_API_or_other_source,
    markup = specdown.markup.all(markdown);
```

### Simple Web Usage

Specdown can be used to perform a one-time translation on a string. It is possible to only perform a subset of available markups, but the below example shows using all markups.

###### html
```
<head>
  <script type="text/javascript" src="pathtofile/specdown.js"></script>
```
###### javascript
```
var markdown = from_an_API_or_other_source,
    markup = specdown.markup.all(markdown);
```

### Live Web Usage
Specdown, when used in the browser, contains functionality to enable editing with live markup and live preview. Input from the markdown textarea is read on initiation and input change, markuped for all syntax, and output to the markup textarea and or preview element.

###### html
```
<textarea id="markdownID"></textarea>
<textarea id="markupID" disabled></textarea>
<div id="previewID"></div>
```
###### javascript
```
// start live markup and output
specdown.markup.live('markdownID', 'markupID', 'previewID');

// markup textarea can be omitted if not needed or used
// specdown.markup.live('markdownID', null, 'previewID');

// preview element can be omitted if not needed or used
// specdown.markup.live('markdownID', 'markupID');

```

---

### API

#### specdown.config

Alter runtime behavior.

#### specdown.markup.all(markdown)

Translate all Specdown notation in the markdown string and return the HTML markup as a string.

#### specdown.markup.live(markdownId, markupId, previewId)

Automatically specdown.markup.all the value of the element with ID markdownId and place it into the elements with IDs markupId and previewId on initiation and when the value of the element with ID markdownId changes. markupId and previewId are optional.

---

### Wishlist

- Fully implemented Metas
- Blank image syntax markups button for file browser in live.
- Blank link syntax markups button for file browser in live.
