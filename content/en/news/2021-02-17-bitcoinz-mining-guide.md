---
title: "BITCOINZ MINING GUIDE"
date: 2021-02-17T00:00:00Z
draft: false
subject: "Updates"
image: "/images/news/Mining_BTCZ-400x250.png"
---

Welcome to our mining guide in 4 easy to follow steps!

In themain Sectionwe will explain in very easy steps the basics so that even a novice will learn how he can use a Personal Computer in order to mine BitcoinZ.

In thebonus Sectionwe will give some extra tips that could possibly help even people that are already in

MAIN SECTION HOW DO I MINE WITH MY PC ? AN EASY GUIDE FOR MINING BITCOINZ

BitcoinZ is a very interesting Community driven digital coin.(Learn more why BITCOINZ deserves your attention).

Let’s see what we need :

1)A PCwith a graphic card unit. (at least a GTX 1050).In the pc of our test , we have a 1070ti nvidia GPU and we are using Windows 10.2)The miner applicationthat will use our graphic card in order to contribute to the calculations of the BITCOINZ algorithm. As miner application we are going to use the MiniZ miner. MiniZ is very easy to setup and uses effectively almost all the nvidia gpus. It works with many different Equihash algo variants and of course with the Zhash algo of BITCOINZ.3)A BITCOINZ walletin order to create the address for our payments from the mining procedure.4)A mining poolwhere we can combine our mining power with other people in order to get payments in a more stable pace. Imagine something like the power of the swarm in action…as many small miners united can have much better results.

How to download the miner application files.

We are going to theminiz.churl and we click on the “Download” and “Download Latest Version”. We choose the windows version and we write down the zip password “miniZ”.

How to download the BITCOINZ Wallet files.

We are going to getbtcz.com site and we click on the menu “ABOUT BITCOINZ”  and “BTCZ WALLETS”. There we download the wallet of our choice. Each wallet option has different features and some of them support more than one coin type. For our example we are choosingthe BITCOINZ Light wallet for Windows PC. We click this option and we are transported in the relevant GitHub page where we download theBitcoinZ Wallet Release 10.20(the version might be higher after some time, this would be completely ok).

So now we have the needed files for both miniZ miner and BitcoinZ wallet!

Unzipping the files

We now need to uncompress these files but before this  please take in mind something important :  The .exe and .bat files of the most mining software and cryptocurrency wallets are givingfake virus alerts, and the windows defender or other antivirus programs will possibly automatically quarantine them.

For this reason we are going to create a folder that will be added asan exclusion to the anti-virus programs.

In our example, we named our desktop folder  “mining applications”. We open our Windows Virus & Threat Protectionà we choose “add an Exclusion” and Folder and we select the newly created folder “mining applications” from our desktop.

This waywe don’t deactivatethe defences of our PC andwe are able to runthe mining and the wallet software.

We copy the the .zip uncompressed files that we had downloaded in the previous steps in our “mining applications” folder. We can now unzip them in their relevant subfolders that are automatically created with the unzipping procedure. For the miniZ decompression we are using the miniZ password.

.

Running the BITCOINZ wallet

We run the .exe file from the subfolder where the BITCOINZ wallet 10.20 was uncompressed. (or any BitcoinZ that we had chosen).

In the case that we receive any warning from real time virus protection software , we are ignoring this and we grant the needed permission in order to run the file.

We do realize that the BitcoinZ Light wallet has a very friendly interface. It explains everything in every step. We learn what is a digital coin and why we should always write down our backup phrasebeforeusing the wallet application.

So we write down our backup phrase and store it in a safe place. The back up phrase  should never be shared with anyone!

We are now ready to use our fresh installed BitcoinZ wallet and tocopy our BitcoinZ address. This is the address where our payments from our mining contribution will be sent to!

Choosing a Mining Pool

Let’s visit the getbtcz.com site in order to choose a pool to join. By choosing a mining pool , we join other miners and we combine all our mining power. This way we have higher possibility to get block rewards especially if our mining power is low.

We choose the menu option “ABOUT BITCOINZ” –> “MINING BITCOINZ“. We see a list of some of the most popular mining pools of the project.

In our example we are choosing the first one , the “BTCZApp mining pool”. By clicking on its name we are transfered to its site (https://mine.btcz.app/getting_started) where we can get the settings that miniZ is asking for.

Server : mining.btcz.app

Port: 3032

Running the miniZ application & mining!

So we can now run the miniZ miner aplication  (the icon with the orange logo).

As we can see, the miniZ miner has just a few fields that we have to fill in order to have it ready to run. The necessary are: The server of the mining pool (option 3 in the image below) ), the port (option 4), the type of algorithm / coin(8 & 9) and the address for our payments (wallet field 5) .

We have all the needed information to fill its GUI :

Username : our BTCZ address

Algo : 144.5

Pers: BitcoinZ

Server : mining.btcz.app

Port: 3032

Of course a different mining pool has different Server and Port info, so you enter these accordingly to your choice of pool.

We press the “Start” button and we start mining!

The MiniZ Graphical User Interface launches the .bat file based on our given values.

So a Command Prompt is opening and it shows important information about the mining procedure like the used GPUs (this example would work even for multiple GPUs), the temperature of each GPU, the hashrate (mining speed), the power consumption and more.

After some time you will see your wallet receiving BitcoinZ coins. This is your reward for your contribution to the BTCZ network. Each time that the chosen mining pool is finding the solution for a block, all the miners that contribute to this pool (including you) are receiving a percentage of the block reward. This is based on their hashrate. For example if a miner contributes an average 10% to the pool’s hashrate, then his shares for the next block reward that is found by the pool will be 10%.

BONUS SECTION:    EXTRA TIPS FOR MINING BITCOINZ

In this bonus section, we will give some extra tips for mining.

We will begin from the most important : How to make your mining moreefficient.

With “Efficiency” we mean the best possible hashrate with the lowest possible power consumption.

We should never forget that hitting a “super high” mining speed is not always the smartest idea. Especially in countries with high energy cost, this could be a very bad idea. Because your energy cost would bedisproportionatelyhigh. Additionally the temperatures could be rising to harmful levels reducing this way your hardware’s life.

For these reasons it is much wiser to setup your hardware in order to find a golden line. The sweet spot where you get the best results with a logical consumption and a relatively low temperature. So we are going to use MSI Afterburner which is a free software that can help us to set a power limit, or specific clock speeds for the cpu and the memory of our card.

We have to underline that each GPU type and mining algo combination,  has different ‘ideal’ settings in order to achieve maximum efficiency.  Even different variants of he same GPU might have some differences because some models are coming with higher power consumption or different memory types. So we strongly advice to experiment a little with your hardware and the Afterburner application in order to find the best efficiency for the power consumption and the temperature that you consider ideal for your case.

In our example, we are using a Gigabyte GTX 1070 ti.

We have found that the specific card if you let it run in factory / default settings (100% power , +0 Memory, +0 CPU clock), you would get a hashrate around66 Solswith180Wpower consumption and a high enough temperature that could vary between74-80+°Cdepending on the temperature of your room.

With our suggested settings of 74% Power, +250 MHz Memory, +155 MHz CPU Clock) we achieve a mining speed of around63 Solswith128Wpower consumption and a63 – 69°C

This obviously means that we have a just -5% lower mining speed but with a -26% lower power consumption and a much cooler card!

The efficiency in the default settings are around36 Sols per wattwhile with our settings touches the50 sols per watt!
