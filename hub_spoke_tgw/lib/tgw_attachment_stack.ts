import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

interface AttachmentProps extends cdk.StackProps {
  vpcs: [ec2.Vpc, ec2.Vpc, ec2.Vpc];
  subnets: [ec2.ISubnet[], ec2.ISubnet[], ec2.ISubnet[]];
  transitGateway: ec2.CfnTransitGateway;
}

export class TGWAttachmentStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props: AttachmentProps) {
    super(scope, id, props);

    // Create the vpc attachment
    new ec2.CfnTransitGatewayAttachment(this, 'TgwAttachment', {
      vpcId: props.vpcs[0].vpcId,
      transitGatewayId: props.transitGateway.attrId,
      subnetIds: [props.subnets[0][0].subnetId]
    });

    // // Create the vpc attachment
    // new ec2.CfnTransitGatewayAttachment(this, 'TgwAttachment', {
    //   vpcId: props.vpcs[1].vpcId,
    //   transitGatewayId: props.transitGateway.attrId,
    //   subnetIds: [props.subnets[1].subnetId]
    // });

    // // Create the vpc attachment
    // new ec2.CfnTransitGatewayAttachment(this, 'TgwAttachment', {
    //   vpcId: props.vpcs[2].vpcId,
    //   transitGatewayId: props.transitGateway.attrId,
    //   subnetIds: [props.subnets[2].subnetId]
    // });
  }
}