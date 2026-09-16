provider "aws" {
    region = "us-east-1"
}

resource "aws_security_group" "dispatch_sg" {
    name        = "dispatched-mesh-firewall"
    description = "Open ports for DispatchMesh"

    # SSH
    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # Node.js
    ingress {
        from_port   = 3000
        to_port     = 3000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # FastAPI
    ingress {
        from_port   = 8000
        to_port     = 8000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # Outbound Traffic
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

# EC2 Server
resource "aws_instance" "dispatch_server" {
    ami             = "ami-0c7217cdde317cfec"
    instance_type   = "t3.micro"
    key_name        = "dispatch-mesh-key"

    vpc_security_group_ids = [aws_security_group.dispatch_sg.id]

    tags = {
        Name = "DispatchMesh-Production-Server"
    }
}

output "server_public_ip" {
    value = aws_instance.dispatch_server.public_ip
}