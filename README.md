pgVideo
=======

A custom HTML5 video player built with jQuery.

Usage
-----
To use this plugin you first need to include it's css file:

     <link rel='stylesheet' href='css/video.css' />

Then include the latest version of jQuery and jQuery UI. 
If you'd prefer to use a custom build of jQuery UI it has to have Core, Widget, Mouse, and Slider. 

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/jquery-ui.min.js"></script>

Finally, add the plugin's js file and the included `jquery.threeDots.min.js`, which is used to truncate long titles:

    <script src="js/jquery.pgVideo.js"></script>
    <script src="js/jquery.threeDots.min.js"></script>

You can then call the plugin on an empty div like so:

    ('#player').pgVideo();

However, that will only load the player with nothing to actually play. To get it to have a video 
set up the 3 different types of your video file:

    $('#player').pgVideo({
    	mp4: 'big-buck-bunny.mp4',
    	ogv: 'big-buck-bunny.ogv',
    	webm: 'big-buck-bunny.webm'
    });

You need the three different types if you want to target all modern browsers but you can use just one if you want.

There are many options that you can add to the plugin initializer as well -
- theme - (text) Switches css styles to one of your choosing. Default: 'grey'.
- poster - (text) Sets the poster image while video loads. No default. 
- title - (text) Title is used next to the Now Playing section. Default: 'No Title'.
- preload - (text) Determines what to preload on load, if at all. Deafult: "auto".
- autoplay - (true/false) Enable or disable autoplaying. Default: false.
- volume - (number) Set initial volume level. 0.0 - 1.0 scale. Default: 0.75.
- loop - (true/false) Enable or disable looping. Default: false.

Example
-------

Here is an example using all options:

    $('#player').pgVideo({
      mp4: 'big-buck-bunny.mp4',
      ogv: 'big-buck-bunny.ogv',
      webm: 'big-buck-bunny.webm',
      theme: 'black',
      poster: 'big-buck-bunny.jpg',
      title: 'Big Buck Bunny Video',
      preload: true,
      autoplay: false,
      volume: 80,
      loop: true
    });

In order to use the theme option, you have to set your own css styles. 
Refer to the included css file and look for anything with `.grey` to see what needs to be created.

For a working example, download the zip file and open up the index.html file.