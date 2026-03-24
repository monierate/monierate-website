---
layout: blog
title: "Segregated Witness: The Simple Idea You Need to Know"
description: To explain how segregated witness works, let’s start with some basics. Blockchain transactions contain signatures and scripts. Signatures are used to confirm the identity of a transaction sender.
createdAt: 2024-08-08T15:51
updatedAt: 2024-08-08T15:51
tag: term
image: /uploads/bitcoin-car-between.jpg
published: true
author: Uyah Mfonobong
---
Blockchain - as we know it - was introduced along with Bitcoin in 2009. The working version of this technology has changed since then. Specifically, the Bitcoin blockchain has undergone several modifications.

Changes to this blockchain’s behaviour or concept are made by core developers. Interestingly, several thousands of modifications have been implemented. One of such is Segregated Witness.

In this article, we expand on the idea of segregated witness. We also discuss its working and functions. If you are interested in the technical aspects of the Bitcoin blockchain, this is for you.

## What is Segregated Witness?

Segregated Witness (SegWit) is an improvement in Bitcoin that removes witness information from the input field of a block.

This implementation changed the transaction format used in the Bitcoin blockchain. It was introduced in August 2017 and has since been in use.

## Peter Wullie: Inventor of Segregated Witness

The idea of segregated witness came from Pieter Wuille.  

Wuille is a native of Belgium. He studied at KU Leuven Master of Engineering Computer Science. After his education, Wullie was employed at Google, Switzerland.

This opportunity marked the beginning of Wullie’s engagement with Bitcoin. The developer has since made significant contributions to the original software. According to this [source](https://www.weusecoins.com/pieter-wuille/), he ranks #2 in the number of commits made to the Bitcoin core repository.

Wullie’s interest in Bitcoin has culminated in more than 1000 contributions. He introduced the Segregated Witness in 2015. This was during the Scaling Bitcoin conference held in December.

In addition to SegWit, Wullie is known for several other projects. This includes Taproot and Schnorr. The upgrade pair was made to increase the network’s privacy.

## How Segregated Witness Works

To explain how segregated witness works, let’s start with some basics. Blockchain transactions contain signatures and scripts.

Signatures are used to confirm the identity of a transaction sender. This property verifies that Mr X did initiate a transaction and not some impersonator - for example. Signatures and some other data are usually bundled up together.

They are put into what is called a ScriptSig. These ScriptSig elements help unlock the Bitcoin for a transaction.  

Now, down to how segregated witness works.

Segregated Witness breaks blockchain transaction data into segments. In this process, the ScriptSig content is removed from a transaction. This content is held in a segment referred to as the witness data.

Every other transaction data remains untouched. This makes up the second segment.

After segmenting a transaction, the SegWit protocol stores witness data elsewhere. Precisely, this data is kept at the end of the blockchain. This effectively reduces the chances of block malleability.

Block malleability can occur in two ways. One is through codes added maliciously after a transaction has been signed. Such codes are added to the ScriptSig.

Block malleability is equally achieved through altered signatures.

Generally speaking, SegWit removes the ScriptSig section. Consequently, signatures and other non-immutable data are no longer at risk of being altered. Any attempt to alter this section of the blockchain renders the transaction invalid.

## SegWit BTC Addresses vs Legacy BTC Addresses

Implementing SegWit creates SegWit addresses within the Bitcoin blockchain. This stands distinct from legacy or traditional BTC addresses. The condition exists exclusively on the Bitcoin blockchain.

SegWit address owners get lower fees per transaction. It is also worth noting the SegWit addresses can interact with legacy addresses and vice versa.

A SegWit address typically appears in two formats. According to this [source](https://support.bitcoin.com/en/articles/6096230-legacy-and-segwit-addresses), addresses in the P2SH format start with a ‘3’ while those with the bech32 format start with a ‘bc1’.

## Benefits of Segregated Witness in a Blockchain

SegWit focused on segmenting blockchain data. However, this simple action came with some important benefits. Here are the benefits:

#### Increased Block Data Size:

The implementation of SegWit notably increased block size limit. Essentially, it enabled the inclusion of more transactions in a single block. Blocks on the Bitcoin blockchain could, therefore, hold more data.

This improvement translates to more transaction processing.

However, SegWit also introduced a block weight concept. This checks that added data does not exceed the block size limit.

#### Lowered Bitcoin Transaction Fees:

Having more transactions per block was a good thing. What was even better was the effect of this. By effect, we mean lowered Bitcoin transaction fees.

Transaction fees are small charges collected for processing a transaction. These fees are sent to bitcoin miners. It serves as an incentive for their work within the blockchain.

So, back in topic. Having more transactions within a single block minimizes the work of the network. As such, senders get to pay less since the task is reduced. Let’s illustrate this.

Imagine that four traders need to move their goods using a truck each. Let’s also say these goods have a similar source and destination. In this illustration, the traders are Bitcoin senders, the goods are Bitcoin transactions, and the trucks are blocks on the chain.

Each trader pays a certain amount to have a truck transport their goods. However, if they find a way to use three or two trucks instead of four, they get to pay less. This was the effect of SegWit on the transaction fees within the Bitcoin network.

#### Increased Overall Capacity of the Network:

The Bitcoin community made extensive deliberations before accepting SegWit. At the end of the day, they considered it a positive consideration. We can say that SegWit is exactly that.

The implementation improves the capacity of the Bitcoin network.

## Conclusion

SegWit was introduced as a protocol upgrade. The upgrade was made in a soft fork of the network. This means it has backwards compatibility and does not create a new chain.
