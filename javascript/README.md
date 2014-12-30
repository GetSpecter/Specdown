# Specdown

## JavaScript

The JavaScript implementation of Specdown.

### Methods

#### specdown.markup.all(markdown)

Translate all Specdown notation in the markdown string and return the HTML markup as a string.

#### specdown.markup.live(markdownId, markupId, previewId)

Automatically specdown.markup.all the value of the element with ID markdownId and place it into the elements with IDs markupId and previewId on initiation and when the value of the element with ID markdownId changes. markupId and previewId are optional.

#### specdown.markdown.all(markup)

Translate all HTML markup in the markup string and return the Specdown markdown as a string.

#### specdown.markdown.live(markupId, markdownId, previewId)

Automatically specdown.markdown.all the value of the element with ID markupId and place it into the elements with IDs markdownId and previewId on initiation and when the value of the element with ID markupId changes. markdownId and previewId are optional.