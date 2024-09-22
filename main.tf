provider "aws" {
  region = "us-east-1"
}

resource "aws_db_instance" "defaultt" {
  allocated_storage    = 20
  engine             = "postgres"
  engine_version     = "13"
  instance_class     = "db.t2.micro"
#   name               = "postgres"
  username           = "postgres"
  password           = "password"
  skip_final_snapshot = true
  db_subnet_group_name = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.default.id]
}

resource "aws_vpc" "default" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "subnet1" {
  vpc_id            = aws_vpc.default.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_subnet" "subnet2" {
  vpc_id            = aws_vpc.default.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
}

resource "aws_db_subnet_group" "default" {
  name       = "my-db-subnet-group"
  subnet_ids = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]

  tags = {
    Name = "My DB Subnet Group"
  }
}
resource "aws_security_group" "default" {
  name        = "db-security-group"
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
