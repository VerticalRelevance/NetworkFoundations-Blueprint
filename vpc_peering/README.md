# AWS Network Foundations - VPC to VPC Communication

This project contains the product Infrastructure as Code written in AWS CDK using Typescript. This blueprint can be used to create a network architecture and VPC Peering connections as shown in the diagram below. 

Please refer to the AWS Network Foundations - VPC to VPC Communication Playbook for details on this implementation:
https://netorg597908.sharepoint.com/:w:/s/AWSTEST/EeFrn8onQxlPnVtVUQSSOecBuTfjw2LLtxvE8L2TsiR0RQ?e=MpfVbY

## Pre-requisites

1. Install NPM and Node.js: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
2. Install and configure AWSCLI: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html
3. Install AWS CDK: https://docs.aws.amazon.com/cdk/latest/guide/cli.html
4. Install Typescript: https://www.typescriptlang.org/download

## Architecture Diagram

![image](https://user-images.githubusercontent.com/13501832/141317552-21745a28-1e60-46af-a1e9-e205464870f3.png)



## Variables

The `cdk.json` file tells the CDK Toolkit how to execute your app. The following variables are given a default value as shown below. These values can be adopted for your requirements by modifying the cdk.json file. 

*   "appName": "three_tier_app" - Added as a tag and used as prefix for certain resource names. 
*   "vpcCidr": "10.0.0.0/16"    - VPC CIDR
*   "publicCidrMask": 24        - CIDR space for the Public Subnets
*   "privateCidrMask": 24.      - CIDR space for the Private Subnets
*   "isolatedCidrMask": 28      - CIDR space for the Isloated Subnets
*   "natGateways": 1            - Number of NAT Gateways. Ideally atleast 2 should be used for high availability but 1 is used for demo purposes.
*   "maxAzs": 3                 - Number of AZs to span the VPC across. Some regions only have 2 AZs. 
*   "owner": "OWNER_NAME"       - Used for tagging purposes
*   "environment": "dev"        - Used for tagging purposes

## Deployment

 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
