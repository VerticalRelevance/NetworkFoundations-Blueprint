#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { NetworkFoundationsPortfolioStack } from "../lib/network_foundations_portfolio-stack";
import { VpcStack } from "../lib/vpc_with_private_dns_product";
import { VpcPeeringStack } from "../lib/vpc_peering_product";

const app = new cdk.App();

// const envUSWest2 = {
//   account: "899456967600",
//   region: "us-west-2",
// };

const vpcProduct = new VpcStack(app, "threeTierVPC", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
const vpcPeeringProduct = new VpcPeeringStack(app, "VPCPeering", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const serviceCatalogPortfolio = new NetworkFoundationsPortfolioStack(
  app,
  "NetworkFoundationsPortfolioStack",
  {
    products: [vpcProduct.vpcProduct, vpcPeeringProduct.vpcPeeringProduct],
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  }
);
