---
layout: blog
title: "Mempool: Everything You Need to Know"
description: Mempool is such a simple yet useful blockchain implementation. It draws inspiration from a "waiting area". Blockchain transactions are moved into a mempool and held there ahead of transaction processing
createdAt: 2024-09-16T10:22:00
updatedAt: 2024-10-02T10:22:00
tag: term
image: https://ik.imagekit.io/monierate/Blog/Mempool.png
published: true
author: Uyah Mfonobong
---
![Mempool - Everything you need to know](https://ik.imagekit.io/monierate/Blog/Mempool.png)

Mempool is such a simple yet useful blockchain implementation. It draws inspiration from a "waiting area". Blockchain transactions are moved into a mempool and held there ahead of transaction processing.

If you understand that basic concept, you'd find this easy to grasp.  

## What is Mempool?

If you notice, mempool appears short for “memory pool”. It actually is. A memory pool is a storage/convergence area for yet-to-be-approved blockchain transactions.

This storage is created within the memory of an active node. It holds unconfirmed transactions, meaning those transactions that have not been added to any block.

## How Mempool Works

#### First, how Blockchain works

As a Monierate reader, you know how blockchain works. At least, the basics. So, you know that blockchain has no central storage.

It is a decentralized system that discards the traditional network structure. No one device/entity is single-handedly responsible for holding or processing data. Yet, data is continuously created, processed, and recorded.

This means all nodes actively participate in the network activities. The activities range from consensus to transacting. 

#### Branching into when transactions are made

A blockchain transaction is one of a kind. It involves a user sending some tokens to another user. The process flow makes the whole thing unique.

First, tokens are sent with some fees. This is similar to traditional transactions. The larger the transfer amount, the higher the fee required.

Both small and large transactions sit in a dedicated storage. They are not immediately processed when the send button is hit. This holding area is what we describe as memory pool.

#### Mempool Functioning

A mempool houses pending transactions. It also automatically categorizes them based on size. As a result, network miners can sort through quickly - moving from large to small.

The largest transactions in a mempool receive top-most priority. Once those are cleared, smaller-sized transactions are handled next. 

But why is this so?  

One is that large transactions cost considerable amounts of gas fees. Think of it like paying higher waybill for a valuable shipment. Of course, this results in faster clearance and processing.

Two is that large transactions offer huge rewards to miners. Promising incentives attract miners. Essentially, the more the number of large-size transactions in a mempool, the faster it is attended to.

This all go to show why mempools with large transactions get emptied quickly.

## Mempool Properties

In this section, we explore mempool unique properties. 

#### Mempool speed

Mempool speeds vary. It is easy to acknowledge this on blockchain-to-blockchain comparison. However, nodes within a network also have vary mempool speeds.  

So why does a mempool (in the node level) perform (even slightly) faster or slower than its counterparts? Here’s the answer:  

-   **The Node Architecture**: Don’t forget that nodes are machines in a blockchain network. Individual users own these machines - and the design, capacity and functionality of each may differ.  Assuming every other factor to be equal, the memory in node A will perform differently from that of node B - whether better or poorer.

-   **The blockchain architecture**: It is impossible to neglect the impact of the blockchain itself. Nodes in a blockchain operate based off the network's design. This implies that a slower blockchain will force node mempools to operate slowly. In addition, dynamic gas fee fluctuations have a huge impact on mempool speed. Ethereum is one network where this problem is most visible.

-   **Transaction sizes**: Under mempool functions, we explained a key detail. It is that larger transactions are processed first. Smaller transactions remain in the mempool while this goes on.  What then happens if mempool A has transactions that are all larger than those in mempool B? The answer should be quite clear. Mempool A is given priority by the network.

#### Stucked or cancelled transactions

Blockchain transactions sometimes get stuck in a mempool. 

If a transaction remains stuck for hours, the network automatically cancels it. The transferred token (already deducted from the sender’s account) will be returned. At the same time, the sender will be notified about the cancellation.

Now you’re probably wondering why a transaction will ever be stuck. Well, it’s not some technical issue on a blockchain network. Instead, it’s a drawback of mempool.

Imagine a situation where a memory pool has 20 transactions. Let’s say 19 of them are large and one is not. This one transaction is automatically set to be processed last.

In the Ethereum network, processing each transaction takes around 12 minutes. That means it would take approximately 228 minutes before the small-sized transaction (in our example) finally leaves the mempool.

This could cause a significant challenge. For instance, if the small transaction was made for/from a fast moving business.

## Bitcoin vs Ethereum Mempool

In this section, we will be comparing the Bitcoin and Ethereum mempools.

We should mention that these are network-level mempools. A network mempool constitutes all the mempools that are in all of a network’s nodes.

The Bitcoin network has one. The Ethereum network has one. The Solana network has one - and so on.

**Bitcoin mempool features:**

-   makes use of Proof-of-Work (PoW) consensus mechanism. This was introduced with the Bitcoin network. Many blockchains currently use this system.
    
-   have minimal network problems. Transactions move at a slow pace compared to many other networks. Nevertheless, the network speed is satisfactory.
    
-   mempool transactions happen courtesy of miners. It involves human participation. No smart contracts are used.

**Ethereum mempool features:**

-   As in the Bitcoin mempool, the Ethereum mempool applies  PoW. This was introduced with Ethereum 2.0. Formerly, Ethereum relied on Proof-of-Stake (PoS) for consensus. 
    
-   Have inherent network slow-down. The congestion is high due to Ethereum's support for smart contracts and decentralized apps (dApps). Immense computational power is required.
    
-   Introduces smart contracts. These programs perform actions when certain conditions are met. In the Ethereum mempool case, smart contracts automate transactions and interactions. They do not override the role of human validators. 

Here, the behavior/characteristics of each node’s mempool culminates into the whole. The network architecture also has a role to play.

## Benefits of MemPool

Blockchain mempool has its benefits. Let's look at some of them. beneficial. 

-   **Transaction Buffering**: With so many nodes and thousands of transactions happening simultaneously, mempools allow efficient transaction management. The entire blockchain system can better store and process transactions.

-   **Network Efficiency**:
Memory pooling increases network efficiency. This is because holding unconfirmed transactions prevents system overload. Resources can be allocated to other tasks, increasing the process flow.

-   **Mitigating Spam Attacks**:
 Spam attacks involve bulk fake transactions. They are intended to cripple a network by unnecessarily utilizing all/most of its resources. This pushes the network to a breaking point.

Thankfully, decentralized mempools disrupt these kinds of attacks. It does so by filtering out low-value or invalid transactions - which are often utilized in the spam.

## Conclusion

To wrap up this article, let’s briefly explain everything.

Blockchains are made of nodes and every node has a memory pool. Technically, this implies that “There are as many mempools as there are nodes.” 

Together, each of these forms a network-wide mempool.

The memory pool provides essential transaction holding services. It aims to foster a flow which prioritizes large transactions. 

As simple as this sounds, the mempool implementation helps promote network efficiency while mitigating spam attacks.
