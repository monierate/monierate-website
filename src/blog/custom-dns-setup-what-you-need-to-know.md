---
layout: blog
title: "Custom DNS Setup: What You Need to Know"
description: To cut to the chase; A DNS server translates those easy-to-remember website addresses (like google.com) into the complex numbers (IP addresses) that computers understand.
createdAt: 2024-08-29T19:51
updatedAt: 2024-08-29T19:51
tag: terms
image: https://ik.imagekit.io/monierate/Blog/Listicles/dns.png
published: true
author: Victory Emmanuel
---
![DNS for browsing speed](https://ik.imagekit.io/monierate/Blog/Listicles/dns.png)

So you just heard about custom DNS servers and how they can significantly improve your internet speed and even help you access crypto sites that may be blocked in your region. And you don’t know where to start or how it works.

To cut to the chase; A DNS server translates those easy-to-remember website addresses (like google.com) into the complex numbers (IP addresses) that computers understand.
  
This behind-the-scenes magic is what gets you to your favourite sites and also offers a faster browsing experience compared to paying for VPNs.

Ready to get the full gist? Keep reading!

## Understanding DNS
DNS stands for "Domain Name System".

When you type a website address like "monierate.com" into your browser, you’ll instantly land on the right landing page. It might seem straightforward, but there's a clever system working to match that domain name to its associated IP address called DNS.

DNS could be seen as the translator for your internet experience and you don’t get to memorise long strings of numbers–you simply enter a website's name.

You see the computer understands a certain type of language (machine-readable language) even though you typed in a Human-Readable Language like (monierate.com).

The DNS takes care of the translation and connects you to the right website.

Here's a simplified breakdown:
-   You type a website address (like "monierate.com") in your browser.
-   Your computer contacts its current DNS server, which is often provided by your internet service provider (ISP).
-   The DNS server checks its phonebook (a giant database) and finds the website's actual address (the IP address).
-   Once it finds the correct address (the IP address), your computer connects to that address and loads the website.

In optimal conditions, this process is almost instantaneous, often taking less than a second. However, if the DNS server is slow or the network is congested, it might take a bit longer.

Now, here's the interesting part: you can actually choose which DNS server your phone or computer uses instead of sticking with the DNS server your internet provider gives you.

By switching to a custom DNS server, you might experience faster load times, better security, or even access to websites that your ISP might block. Sounds just like a custom map with extra details and shortcuts if you ask me.

![DNS for browsing speed](https://ik.imagekit.io/monierate/Blog/Listicles/dns-to-ip.jpg)

In the next part, we'll explore the different DNS servers and the benefits of using each one.

## Types of DNS servers
You’re going to hear a lot about Custom DNS and Smart DNS. As the name implies, DNS and Smart DNS are close in their work but with a fundamental difference.

### Custom DNS
Is there a way to potentially speed things up while browsing? A custom DNS fills the gap.

By default, your devices use the DNS servers provided by your ISP. These servers keep a record of the websites you visit (the domain names) and their corresponding addresses (IP addresses). While this is part of how the internet works, it does mean your ISP can see your browsing history.

With a custom DNS server, you can switch to one offered by a different company, like Google or Cloudflare. These public DNS services are often faster than the ones your ISP provides, which can lead to quicker loading times for your favourite websites. However, it's important to note that this change won’t hide your IP address, encrypt your data, or unblock geo-restricted content.

Even cooler, some custom DNS servers offer extra security features. Imagine someone trying to redirect your mail to the wrong address! DNS cache poisoning attacks try to do this online, sending you to malicious websites. Custom DNS like [Google’s](https://developers.google.com/speed/public-dns/) or [Cloudflare’s DNS](https://developers.cloudflare.com/1.1.1.1/setup/) services come equipped with DNSSEC (Domain Name Security Extensions) that helps to prevent this by ensuring you reach the real website.

A quick tip: You can avoid this type of attack using basic online hygiene including a firewall, and antivirus software, and being careful with your downloads.

There are a few things to keep in mind though. Switching DNS servers won't hide your IP address or unblock restricted websites entirely. It also won't completely prevent your ISP from seeing some of your online activity, as your requests still pass through their network.

But if you're looking for a potential performance boost and some extra security online, a custom DNS server might be worth a try. It's easy to set up on most devices, and we'll show you how below:

#### How to use Custom DNS
Here’s how to use a custom DNS server:
-   **First, pick your DNS provider.** Popular options include Google's 8.8.8.8 and Cloudflare's 1.1.1.1. These offer good speed and security.
-   **Next, find your device's settings.** The exact steps vary depending on whether you're using a Windows PC, Mac, iPhone, or Android. Generally, you'll look for network settings or Wi-Fi connections.
-   **Once you've found the right settings, look for a place to input DNS addresses.** It's usually under something like "manual DNS" or "custom DNS."
-   **Enter the new DNS addresses.** You'll need both a primary and secondary DNS server. For example, for Google's DNS, you'd enter 8.8.8.8 as the primary and 8.8.4.4 as the secondary.
-   **Save your changes.** That's it! Your device should now use the new DNS server.
    
**A quick tip:** If you're unsure about making changes directly to your device, consider changing the DNS settings on your router. This will affect all devices connected to your network.
    
### Smart DNS
Similar to VPNs, Smart DNS lets you access content that's unavailable in your region.

But instead of rerouting all your internet traffic, Smart DNS is a bit more focused. It specifically changes how your device sees certain websites, tricking them into thinking you're in a different location.

How does it work?

Well, when you try to access a geo-restricted crypto platform, your device normally tells the service where you are based on your IP address. With Smart DNS, your device is tricked into thinking it's somewhere else. This lets you access content that's usually blocked in your region.

It's especially useful also for people with smart TVs, gaming consoles, or other devices that can't run a VPN or those looking to stream content from different regions without the need for encryption or added security features.

#### How to use Smart DNS
To use Smart DNS, you’ll need to subscribe to a service and configure it on your device. This usually involves entering the IP address provided by your Smart DNS provider into your device’s DNS settings. 

For example, on an Apple TV, you would

1.  Navigate to the network settings
2.  Manually enter the DNS address, and restart the device.

The process is similar on gaming consoles like the PS4 and PS5, where you’ll manually input the DNS addresses given by your provider to activate the service.

## Custom DNS vs Smart DNS vs.VPNs: When to use each?
Changing your DNS on your phone can offer some benefits, but it’s important to understand how it compares to using a VPN.

DNS and Smart DNS excel in speed and simplicity, with services like Google DNS and Cloudflare DNS offering faster browsing and features like DNS-over-HTTPS. Ideal for bypassing geo-restrictions without compromising speed but lack encryption, leaving your data vulnerable.

Smart DNS shines for streaming, allowing quick access to region-locked content, but like standard DNS, it doesn't protect your data from threats.

VPNs, on the other hand, provide comprehensive security through encryption, masking your identity, and allowing access to geo-blocked content. While VPNs may slow your connection due to encryption, they are essential for secure activities like browsing, gaming, or torrenting.

In summary, use DNS or Smart DNS for speed and easy access to geo-restricted content, but opt for a VPN when security, privacy, and broad access to restricted content are crucial.

![DNS for browsing speed](https://ik.imagekit.io/monierate/Blog/Listicles/pros-cons-dns-vpns)

## Conclusion
Now that you have a clear understanding of DNS, you can adjust your DNS settings to suit your needs with confidence. While there’s a clear debate between using DNS, Smart DNS, and VPNs, each has its unique strengths. 

Ultimately, while DNS and Smart DNS offer specific advantages, a reliable VPN remains the most robust solution for ensuring both access and security in your online activities.


### Frequently Asked Questions
**Is Changing My DNS Safe?** Yes, changing your DNS is safe if you use a reputable provider like Google or Cloudflare. However, using an unreliable DNS provider can expose you to risks like DNS poisoning, hijacking, and data selling.

**Can I Use Smart DNS and a VPN Together?** It’s not recommended to use Smart DNS and VPN together, as they may conflict and cause connection issues. If you need security and speed, choose a fast VPN like ExpressVPN instead.

**Should I Get Smart DNS if I Have a VPN?** If your VPN provider includes Smart DNS, you don’t need a separate subscription. Many premium VPNs, like ExpressVPN, offer Smart DNS as part of their service.

**Is DNS Better Than VPN?** DNS can offer faster speeds for streaming, but a VPN is better overall for security, privacy, and bypassing censorship. VPNs also encrypt your data, providing more comprehensive protection.

**Can I Use Free VPN or DNS Services?** It’s not advisable to use free VPN or DNS services, as they can compromise your privacy by logging your data and selling it. Opt for a trusted, paid service for better security.

**How to Troubleshoot Custom DNS Issues?** To troubleshoot custom DNS issues, check your provider and DNS settings, clear your browser cache, reboot your device, or try a different browser. If problems persist, contact customer support.

**Is DNS in My Router?** Yes, your router typically acts as a DNS relay for your network, forwarding queries to a DNS server. You can change your router’s DNS settings to a more secure option if needed.

**What is My DNS IP Address?** To find your DNS IP address on Windows, open Command Prompt and type ipconfig /all, then look for the “DNS Servers” section.
