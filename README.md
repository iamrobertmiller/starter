#Front-end development notes#

####CSS####

Use Bootstrap SASS version, don’t include styles for components/features not used 

- Switch custom styles to SASS (from PostCSS)
- Still keep separate partials
- Nest styles where applicable rather than everything longform

The `/scss/libs/` and `/scss/partials/` folders contain a README with some info.

####Javascript####

- Concat and minify all JS files (excluding jQuery and/or Modernizr)
- All relevant JS/jQuery plugins or libraries (usually found in your vendor folder)
- Vendor files would only be jQuery, Modernizr and any other files that go across individually
- Other JS files, including jQuery plugins etc would be in a libs subdirectory of `/js`

The JS does a concat/minify - but note that it will only take the js files in the `/js/libs/` folder and concat with main.js then minify that final file. The bootstrap js should be in the` /js/libs/` folder since it can just be concat'd into main js

The `/js/libs/` folder contains a README with some info.

Files within `/js/vendor/` don't get concat or minified. This is intentional and you'd only put js files in there that must be loaded (or in WP, enqueued) individually. Modernizr and jQuery would need to stay in vendor because when we take it over into Wordpress, Modernizr would be enqueued on it's own - and we'd just enqueue WP's jquery.

The `/js/vendor/` folder contains a README with some info.

####Images####

Avoid images residing in the css folder. Prefer them in their own folder in the theme/site root (paths in css would change to `../images/`)

_All icons and logos should be SVG, not jpg or png._

####Fonts####

Avoid fonts residing in the css folder. Prefer them in their own folder in the theme/site root (paths in the css would change to `../fonts/`)

####Tasks####

Essentially what we do is take your supplied files and commence our Wordpress theme dev. We have a particular way we like our themes setup etc which is why we only get you to develop the front-end and hand over to us.

We take your static markup and split up into relevant theme files (default files, custom templates/partials), including our own separate files for various Flexible Content Fields (Advanced Custom Fields)

To date what we’ve been having to do is place your supplied files into a ‘static’ folder within our own ‘src’ folder. We have our gulp setup in the root of our project as well as your gulp setup in that static folder. So we need to run 2x npm install. Then we have our gulp watchers also watch the `static/build` folder for whenever we run gulp build on your project, which copies the compiled files out to our dist theme folder along with our own theme php files etc. It’s hacky and a bit of overkill.

We’d like to be able to take your JS / CSS source folders and put them into our theme src folder and have our own (simpler) gulp tasks run from there. We have our own gulpfile with tasks that work for us (compiling, concatenating, minifying, cleaning/copying files etc). Would like to be able to easily just drop your files in.

Or (ideally) you would commence with this project/setup and just add your sass, js, fonts, image files as well the html/shtml files. You’d probably need to add your gulp task that generates the html into the gulpfile but that should be it.

I’ve supplied a sample starter project folder for what we’d ideally like. All we’d need to be able to do ideally is remove your html/shtml files once we have the markup into our template files.

##Naming Conventions##

####Sections####

Class names of sections should not be based on random headings that the PSD design have. 

They should reflect the layout style, not the textual content in the designs.

Eg. in the old IELTS project

[http://thatmarketingcompany.com.au/html-boutique-docs/section.png]()

This section class was titled `section-provide`.  This section would be used throughout the site, and the word ‘provide’ does not correctly describe this section at all.  

Sections should be titled by the layout style. ie. `section-two-column`, `section-one-column`, `section-featured-blocks` etc

We will be using these sections throughout the site and each will have different content, so the class names need to be less literal.

####Headings####

Heading stylings also need to be separated from their container, so they can be used sitewide and still keep their style.

Eg. here is a class style in the old IELTS project...

`
.article-tertiary .article-content h3 {
   color: #00aaad;
}
`

You should have a list of colour variables in the SASS, and a list of classnames for colours. ie. `primary-colour`, `secondary-colour`.  That way these classes can be added to headings irrelative of what section they are placed.

Same goes for font size.  Class names such as `alpha`, `beta` to describe sizes, so these again can be used sitewide.

In a nutshell, more thought needs to be put into heading class names so they can be used SITEWIDE irrelative of sections.

####Style Guide####

The designs will include a "style guide" for you which should be used for global styling of the most common elements without the need for any, or minimal classes. Such as headings (h1 to h6), links, buttons, base ui colour (text), primary, secondary, tertiary etc colours.

####Margin & Padding####

Each section that is build should use margins and not padding (unless specifically required for design purposes).  This is so that each sections margins can collapse into each other, so there are not huge gaps in between sections.

Only use padding if the section has a background colour, then remove margin and add padding.  Add a class such as `with-bg` that removes margin from sections and adds padding etc.

####Article divs####

Many sections that we use and put into Wordpress will be using the WYSIWYG inside Wordpress for content creation.  Therefore content should not have a `section-title` class (for example) for titles, and a `section-body` for text.  These generally will be used for the WYSIWYG in Wordpress and these styles need to work outside of these divs.  See below.

[http://thatmarketingcompany.com.au/html-boutique-docs/section-title.png]()

####Menus####

Menus should always just be undordered lists with a class (eg .nav) on the wrapper `<ul>` element, with no additional classes on the list items or links. Except for setting an active/current element. In this case a single class (eg active) should be added to the `<li>` element of the active item (not the actual link). This should be enough to style any menu and also allow us to use Wordpress menus when we build the actual theme, and the styles still work.

By default a nav should be horizontal (eg like a header menu), and a simple modifier class added the `<ul>` to achieve a vertical stacked menu.

For example internally we use ul.nav for default/horizontal and add `.nav--stacked` for a vertical. 

##Forms##

We almost exclusively use Gravity Forms for all our Wordpress theme dev. Please provide form markup and styling based on Gravity Forms. See supplied html file for sample markup, as well as some sass files we’ve developed over time that help with styling Gravity Forms (in the `scss/libs/gravity-forms/` directory). They just need minor tweaks to variables etc with each site to suit the design.

If you have any forms in the designs supplied to you, these should be developed using Gravity Forms markup and styling. The supplied sass files will get standard Gravity Forms on the site styled. If there are any unique forms that look different to what any normal forms on content pages (eg Contact), these should be explicitly targeted - eg with a unique class on the wrapper div (gform_wrapper). This was the unique styles won’t affect other forms that may be added to pages on the site. A good example of this is when the design has a special newsletter / email signup form (such as in the footer), that is not a standard looking form. We would still use Gravity Forms for this, so the markup and styling should be based on this. Just add a class to that wrapper element and target your styles that way.

You should be able to take the relevant fields (`gfield`) markup to create your form since the example file contains all the available field types.

The form title (`gform_title`) and description (`gform_description`) are optional when embedding a form. So if the form you’re building from the supplied designs doesn’t have one of these, just leave out that element/markup.

The main structure should always remain (`gform_wrapper, gform_body, gfield, gform_footer` etc)

Because this is just static markup - without other assets (js etc) required by the plugin - the form won’t be functional, which is ok. We just want the styling. 

You’ll see there’s a `_gravity-forms-custom-select.scss` file which we use for styling select elements. We use this jQuery plugin (http://adam.co/lab/jquery/customselect/) which you’ll want to include in your builds. You’ll just need the js file, as the sass file provides the styling.

The initialise of the custom select should be run on Gravity Forms `gform_post_render` event (which gets fired even on the example markup we’ve supplied). 

Sample code can be found in `main.js` which would target all relevant select elements in Gravity Forms.

