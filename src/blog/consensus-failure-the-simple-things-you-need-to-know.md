---
layout: blog
title: "Consensus Failure: The Simple Things You Need to Know"
description: A Consensus Failure is a situation in which nodes disagree on what blockchain to adopt or whether a block transaction is valid or not.
createdAt: 2024-08-04T11:26
updatedAt: 2024-08-04T11:26
tag: terms
image: /uploads/blockchain-network.jpg
published: true
author: Uyah Mfonobong
---
Monierate’s previous article on Blockchain [Transactions](https://monierate.com/blog/blockchain-transaction-what-you-need-to-know-now) was exhaustive. There, we said some things about Consensus mechanism. If you remember, this feature makes up blockchain's high security.

Well, there’s a blockchain network situation related to that. It is called Consensus Failure.

As the name implies, the consensus mechanism fails. But what exactly is this problem and what are its implications? We bring the answers here in this article.

## What is a Consensus Failure?

A Consensus Failure is a situation in which nodes disagree on what blockchain to adopt or whether a block transaction is valid or not.

It is a special blockchain problem. Generally speaking, this failure stems from poor/wrongful operation of blockchain participants.

Nodes carry out verification and make agreements on transaction results. They do this as a group. A situation where they are unable to achieve this common objective signifies a failure.

Consensus serves as one of the backbone features of blockchain. Being so, a failure is critical. It could crash the blockchain or expose it to hackers.

## Causes of Consensus Failure

In this section, we analyze the causes of a consensus failure.

We should first state that blockchains use consensus protocols. This determines how the nodes go about verifying what blocks to add.

Each protocol tries to implement consensus algorithms efficiently and reliably. But there is only so much they can do. At the end of the day, consensus success cannot always be guaranteed.

What this implies is that consensus is probabilistic.

There’s an assurance that the mechanism will work most of the time. It should pass successfully in nearly every case. However, at one time or another, the system will fail.

Blockchain failures can be attributed to Consensus Failure Bugs (CFB).

CFBs result in a disagreement on which block to append to the blockchain. This creates a fork in the system. Ultimately, multiple duplicate records are formed across the blockchain.

Consensus failure may also result from malicious block transactions. This scenario was exposed in the Bitcoin consensus failure of 2010.

## Risks from a Consensus Failure

The event of a failure in the blockchain consensus mechanism might continue. This is because many blockchains are reducing their block-creation time.

Bearing that in mind, we should speak about the risks.

The most outstanding risk is the possibility of an attack. Blockchain hackers look out for loopholes such as those created when a fork occurs. They exploit this for their gain.

For example, a hacker may take control of part of the network. They may also initiate a double spending attack. This violates the blockchain’s operation, reduces network integrity and causes financial losses.

## Consensus Failure Cases

It appears there are some big flops as far as consensus failure is concerned.

These instances either involve significant losses or damaged institutional reputation. Three cases stand out:

#### Ethereum:

Ethereum has [reportedly](https://thedefiant.io/news/defi/ethereum-researchers-remain-mystified-after-blockchain-briefly-fails-to-finalize) witnessed finalization issues. The event happened on May 11 and 12, 2023.

From the reports, this incident affected the Beacon chain. Beacon chain serves as a consensus layer for Ethereum’s Proof of Stake (POS). It was merged with the blockchain’s mainnet execution layer in September 2022.

The two Ethereum failures occurred separately. The first incident continued for about 20 minutes while the other lasted five times longer.

Ben Edgington of the Ethereum Foundation explained the incident. According to him, “It [was] as if 60% of the validators went offline.” He also added that, "To finalize the chain, we need two-thirds or 66% of validators to show up.”

There were no concrete statements about the cause of the failures. However, Edgington stressed that Ethereum validation now requires higher computational resources. This is due to the recent growth of the network.

#### Infura:

On September 5, 2018, Infura’s Rinkeby experienced a consensus failure.

A [post](https://www.infura.io/blog/post/rinkeby-consensus-post-mortem-4abbcace0539) about the incident explains things in clear terms. It says that some nodes were 3 blocks ahead of the others. Apparently, its Clique consensus protocol had a bug in an earlier version.

Nodes running on the old Geth 1.8.14 version froze first. Those running the later Geth 1.8.16 were stuck not too long after. To resolve the issue, the team rolled back all nodes to Geth v1.8.13.

This move successfully returned the network into consensus. The team then focused on a new release to address consensus challenges.

#### Bitcoin Consensus Failure:

Not like Ethereum is the only blockchain to have consensus problems. To prove that, we turn our focus to Bitcoin.

August 2010 saw the Bitcoin network suffer a historic failure. This event, known as the value or [integer overflow incident](https://en.bitcoin.it/wiki/Value_overflow_incident), created a significantly large block output.

Transactions on a blockchain cannot produce more than a set number of tokens. However, at the time, the Bitcoin blockchain did not account for overly large outputs.

The attacker, therefore, introduced an integer overflow bug.

This involved a transaction whose output was above and beyond the possible limit. Essentially, the output was too large to be represented within the available code storage.

The consensus code did not understand how to process this. Ultimately, it flagged the transaction as valid.

Block 74638 was wrongfully verified and added on the Bitcoin network. On confirmation, it created more than 184 million Bitcoins. These assets were all transferred to three different wallets.

Two wallets received 92.2 Bitcoins each while a third got 0.01 Btc.

Bitcoin developers were alerted and quickly sprang into action. Within five hours, they conjured a new consensus code. This would mitigate such vulnerabilities from ever occurring again.

A new fork was created. Luckily, miners soon accepted it, making the 184 million Btcs non-existent.

## Conclusion

Blockchain consensus cannot be overlooked. In this article, we explored interesting facts about the mechanism. We saw what consensus failures mean and some real cases.

There are many other instances of consensus failures. These cases are gradually winding down. This points to improvements in consensus algorithms and blockchain codes.
