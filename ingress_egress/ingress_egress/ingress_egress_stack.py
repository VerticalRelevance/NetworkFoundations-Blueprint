from aws_cdk import core as cdk

# For consistency with other languages, `cdk` is the preferred import name for
# the CDK's core module.  The following line also imports it as `core` for use
# with examples from the CDK Developer's Guide, which are in the process of
# being updated to use `cdk`.  You may delete this import if you don't need it.
from aws_cdk import core
import aws_cdk.aws_ec2 as ec2


class IngressEgressStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The code that defines your stack goes here
        self.vpc = ec2.Vpc(
            self,
            "VPC",
            max_azs=2,
            cidr="10.10.0.0/16",
            # configuration will create 3 groups in 2 AZs = 6 subnets.
            subnet_configuration=[
                ec2.SubnetConfiguration(
                    subnet_type=ec2.SubnetType.PUBLIC,
                    name="Public", 
                    cidr_mask=24
                ),
                ec2.SubnetConfiguration(
                    subnet_type=ec2.SubnetType.PRIVATE, 
                    name="Firewall",
                    cidr_mask=24
                ),
                ec2.SubnetConfiguration(
                    subnet_type=ec2.SubnetType.ISOLATED,
                    name="TGW",
                    cidr_mask=24
                ),
            ],
            nat_gateways=2,
        )
        core.CfnOutput(self, "Output", value=self.vpc.vpc_id)

        self.tgw = ec2.CfnTransitGateway(
            self,
            "tgw",
            amazon_side_asn = 64512,
        )

        # self.tgwVpcAttachment = ec2.CfnTransitGatewayVpcAttachment(
        #     self,
        #     "tgwVPCAttachment",
        #     subnet_ids=self.vpc.isolated_subnets,
        # )
