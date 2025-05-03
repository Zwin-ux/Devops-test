variable "aws_region" {
  description = "AWS region"
  default     = "us-west-2"
}

variable "db_username" {
  description = "RDS DB username"
  type        = string
}

variable "db_password" {
  description = "RDS DB password"
  type        = string
  sensitive   = true
}
