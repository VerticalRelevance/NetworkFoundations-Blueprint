#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { NetworkFoundationsPortfolioStack } from "../lib/network_foundations_portfolio-stack";
import { VpcStack } from "../lib/vpc-product";

const app = new cdk.App();

const vpcProduct = new VpcStack(app, "threeTierVPC", {});
const serviceCatalogPortfolio = new NetworkFoundationsPortfolioStack(
  app,
  "NetworkFoundationsPortfolioStack",
  {
    products: [vpcProduct.vpcProduct],
  }
);
