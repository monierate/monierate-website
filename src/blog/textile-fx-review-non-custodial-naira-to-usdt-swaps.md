---
layout: blog
title: 'Textile FX Review: Non-Custodial Naira-to-USDT Swaps'
description: Discover Textile FX for secure, non-custodial Naira-to-USDT swaps on-chain. Eliminate P2P risks, enjoy transparent pricing, and access institutional liquidity.
createdAt: 2026-09-15T19:28:00
updatedAt: 2026-09-15T19:28:00
tag: product
image: https://ik.imagekit.io/monierate/Blog/product/textile.webp
published: true
author: Tim Bolarinwa
---

![Textile Onchain FX](https://ik.imagekit.io/monierate/Blog/product/textile.webp)

If you want to convert naira to USDT, you have to deal with P2P traders on Bybit and crypto apps. The issue with using P2P and other crypto apps is that your transaction will go through banks; it might be delayed, and hopefully you don’t get scammed.

If you don’t like USDT and want to get hard physical dollars, you’ll need to meet the informal street traders known as “Aboki”. This can be costly and time-consuming.

Textile FX solves this with non-custodial on-chain FX swaps. Instead of manual bank wires or risky P2P middlemen, you convert Naira into cNGN, a relatively better piece, a Naira-backed stablecoin, then swap it directly into USDT or USDC in a single, transparent on-chain transaction. The same rails work whether you’re an individual moving personal funds or a business settling at volume.

Textile FX has onboarded 78 OTC desks and cross-border payment companies, cleared over $4 million in monthly trading volume, and is backed by institutional liquidity from Tribeca Park Capital, giving individual users the same pricing and liquidity depth that institutions rely on.

You can verify pricing yourself through Textile FX’s live integration on Monierate, and compare its real-time exchange rates against other leading Nigerian FX platforms before you trade.

## **Company/ Product Profile**

| Profile Parameter | Details |
| --- | --- |
| **Website** | [https://app.textilecredit.com](https://app.textilecredit.com) |
| **Established** | TextileFX protocol launched live in 2024–2025 |
| **Chief Executive Officer** | **Tomer Bariach** |
| **Focus** | Instant, request-for-quote (RFQ) and limit-order on-chain foreign exchange swaps between local fiat stablecoins, real-world assets (RWAs), and USD stablecoins |
| **Mission** | Replace slow, costly traditional correspondent bank and OTC foreign exchange rails with an automated, single-transaction on-chain FX solution |
| **Key Market** | Emerging markets (particularly West Africa and Latin America), cross-border payment providers, B2B importers/exporters, and liquidity makers. |
| **Industry** | Decentralised Finance (DeFi) / On-Chain Foreign Exchange (FX) & Real-World Assets (RWA) |
| **Headquarters** | Distributed / Remote (Backed by global web3 funds like Flori Ventures) |
| **Regulations** | **Unregulated / Smart Contract Protocol**: Functions completely peer-to-peer on public blockchains; rate providers/fillers and underlying stablecoin issuers manage localised compliance |
| **User Base** | Institutional OTC desks, cross-border remittance providers, web3 wallet users, automated liquidity fillers, and retail traders |
| **Corridors** | **cNGN - USDT** (BNB Smart Chain & Celo) **wARS - USDT** (Celo) **wBRL - USDT** (Celo) **USDC - USDT** (Celo)  **XAUt- USDT** (Ethereum - Gold) • **NVDA - USDG** (Robinhood Chain) **WETH - USDT** (Ethereum) |
| **Custody Model** | **Non-Custodial**: Operates fully on-chain via smart contracts; Textile never holds user keys, deposits, or funds |

## **How Textile FX Works**

Textile FX runs on a request-for-quote model rather than a public order book you have to browse:

1. **Deposit the amount you want to swap** so you can convert to whatever stablecoin you want (USDT, USDC, WETH, and more)

   ![Textile FX Deposit NGN screen](https://ik.imagekit.io/monierate/Blog/general/textile-swap-screen-2.jpeg)

2. **You name your size**.  Choose a pair, say, sell cNGN, receive USDT, and either the amount you're selling or the exact amount you want to receive.
   ![Textile FX Deposit NGN screen](https://ik.imagekit.io/monierate/Blog/general/textile-swap-screen-3.jpeg)
3. Trades receive a single executable quote bound to the target wallet address with a 60-second expiration window. If insufficient liquidity prevents full execution, the system issues a **'no quote**' response to prevent partial fills at inferior rates
4. Trades settle atomically within a single transaction. Submitting the order prior to quote expiration guarantees that the cNGN transfer and USDT or whatever pair you're swapping, delivery occur simultaneously. Any execution failure triggers a complete transaction revert, eliminating intermediate states or locked funds.

**Note**: Textile FX swaps cNGN into USDT/USDC and vice versa; it doesn't mint cNGN itself. To get from cash Naira into cNGN in the first place, you'd go through cNGN's official platform or a licensed exchange like Busha or Noblocks, which mint cNGN 1:1 against Naira deposits. 

## **What You Actually Pay**

Every swap carries a single on-chain taker fee, already baked into the rate you're quoted before you confirm:

![Selling 1,000,000 cNGN to USDT](https://ik.imagekit.io/monierate/Blog/general/textile-swap-screen.jpeg)

There are no other charges. Their service is highly transparent,  as you can see in the screenshot: converting 1 million cNGN to USDt, the taker fee is roughly 99.99 cNGN; everything else is the effective rate, spread included. 

However, if you place a limit order instead of taking a live quote, you pay no fee at all; the person filling your order pays it.

## **When to Use Textile FX**

Textile FX makes the most sense when:

1. You have USDT, and you want to convert to naira (cNGN) without worry about bank delays or failure.   
2. You have naira, and you need USDT. You simply convert your naira to cNGN, then purchase USDT at the real open market rates.   
3. You want the price locked before you commit. The platform quote model means no slippage surprises between what you saw and what you got.  
4. You're moving a size that would make P2P trading risky.  
5. You're a business, an OTC desk, remittance company, or a cross-border payment provider that needs a settlement rail you can automate against, rather than a manual wire or a middleman you have to trust.

## **Is Textile FX Safe?**

Yes, it is safe. Practically, Textile never holds your keys, takes custody of your funds, or routes transactions through an intermediary pool. 

Your tokens remain safely in your wallet until the exact moment you sign the trade, and the entire swap settles directly between peer wallets in a single, atomic operation. So:

1. Your tokens sit in your own wallet until the moment you sign a swap.  
2. The transaction either completes in full (cNGN out, USDT in), within the same block, or it reverts entirely. There is no half-settled state, so your funds are never stuck mid-transfer.  
3. Textile never asks for custody, never broadcasts a transaction on your behalf, and never holds a private key.

That addresses the biggest fear of traditional P2P trading, whereby an escrow agent or counterparty vanishes mid-trade. It doesn't mean zero risk, you are still trusting the audited smart contracts, your wallet software, and the issuer behind cNGN itself (issuance and asset backing sit with WrappedCBDC, not Textile). But it eliminates human counterparty risk at settlement.

## **Benefits of Using Textile FX**

1. **Non-custodial by design**: Your funds never sit with Textile FX. The swap settles through audited smart contracts, and your wallet stays yours the whole time.  
2. **No hidden spread:** The rate you see already includes the maker's spread and the protocol's fee; what you're quoted is what you get.  
3. **No partial fills at a worse price**: You either get a firm quote for your full amount or a clear "no quote" never a silently smaller, worse-priced trade.  
     ![Textfile FX transaction instructions](https://ik.imagekit.io/monierate/Blog/general/textile-swap-4.jpeg)
4. **Institutional-grade liquidity**: access to a large pool of liquidity to clear a huge sum for both individuals and businesses.  
5. **Verifiable pricing**:  With Textile FX now live on [Monierate](https://monierate.com/exchanges/textile), you can check its rate against other Nigerian platforms before you trade, instead of taking any single source's word for it.  
6. **More than one currency**: Beyond cNGN, the same rail already prices Argentine pesos, Brazilian reais, gold, and even tokenised equities against USD stablecoins, useful if your needs go beyond Naira.
