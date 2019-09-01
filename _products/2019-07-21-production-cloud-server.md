---
layout: page
status: Development
comments: false
---

### Web-app for remotely automated CNC manufacturing
The Production Cloud Server hosts all the manufacturing files and software to integrate a design into a digital automated production line. It can be self implemented with the appropriate knowledge and hardware. For a pre-built business solution check our Mx Industries project.

It has the ability to remotely control CNC machines, allowing for a centralized controlled production line. The production line is seen as a list of IOT CNC machines each with its own client. The server feeds g-code files to these remote machines allowing them to work together in the same design.

Some of the advantages for this approach are:
 - Parallel batch production between multiple coordinated machines
 - Multiple users sharing the same machine
 - Community based production

#### Contents
{% include utils/index-headers.html %}

 ![Production Cloud Server](/assets/images/production_cloud_server_concept.png)

## Production Cloud
The Cloud part of the server enables the users to share their products and IOT CNC machines. This allows the production line to be extended seamlessly into other workshops or some student's garage near you.

## Machine client
The client can be understood as a g-code file queue container installed on a local machine that can perform certain tasks remotely from the production server, such as:
 - Live CNC control and g-code previsualization with [Tiny-G](https://github.com/synthetos/TinyG) and [GRBL](https://github.com/grbl/grbl) controlled machines with [Chilipeppr](http://chilipeppr.com/).
 - Remote USB emulator for non compatible machines (client must be installed on [rpi zero](https://www.raspberrypi.org/products/raspberry-pi-zero-w/))
 - USB hub for file transfer (all g-code files in queue are copied to an external USB when inserted into the host computer)

## Setup guide
<!-- TODO: Tiene que parecer un anuncio Banner como el de projectos  -->
<!-- TODO: Link to github, direct client downlos button and install instructions  -->
<!-- TODO: Link to cloud. There should be a project for how to use the cloud in general temrs  -->
The machine client installation file is available at the [Software Downloads](/open-source/#software-downloads) section.

## Compatible CNC machines

### Medium Aluminum CNC Generation 2.0 Current
This is lightweight machine primarily design with [OpenBuilds](https://openbuildspartstore.com/) assembly parts and some custom CNC aluminum plates.  

#### Gallery
{% include utils/image-gallery.html name='am-cnc-openbuilds' %}
#### Download files
{% include utils/file-binder.html name='AluminumMedium-OpenBuilds-CNC' %}

## Workshop deployment service
<!-- TODO: No es lo mismo que MX industrias sino que talleres especializados y maquinas a la medida  -->
