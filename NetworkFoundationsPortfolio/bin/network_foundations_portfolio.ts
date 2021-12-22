#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { NetworkFoundationsPortfolioStack } from "../lib/network_foundations_portfolio-stack";
import { VpcStack } from "../lib/vpc_with_private_dns_product";
import { VpcPeeringStack } from "../lib/vpc_peering_product";

const app = new cdk.App();

const vpcProduct = new VpcStack(app, "threeTierVPC", {});
const vpcPeeringSCProduct = new VpcPeeringStack(app, "VPCPeering", {});

const serviceCatalogPortfolio = new NetworkFoundationsPortfolioStack(
  app,
  "NetworkFoundationsPortfolioStack",
  {
    products: [vpcProduct.vpcProduct, vpcPeeringSCProduct.vpcPeeringSCProduct],
  }
);
