
@'
# Student Task Manager - Serverless Application with Terraform

## 1. Project Overview

The Student Task Manager is a serverless web application that helps students manage their daily academic tasks. Users can create, view, update, complete, and delete tasks.

The application runs on Cloudflare Workers, stores task data in Cloudflare Workers KV, and uses Terraform for Infrastructure as Code (IaC).

GitHub Actions validates the Terraform configuration when changes are pushed to the `main` branch.

## 2. Objectives

- Build a responsive student task management application.
- Deploy a serverless backend using Cloudflare Workers.
- Store tasks in Cloudflare Workers KV.
- Manage cloud infrastructure using Terraform.
- Maintain source code using Git and GitHub.
- Automate Terraform formatting and validation with GitHub Actions.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Web page structure |
| CSS | Styling and responsive layout |
| JavaScript | Frontend interactions and API requests |
| Cloudflare Workers | Serverless backend |
| Cloudflare Workers KV | Task data storage |
| Terraform | Infrastructure provisioning |
| Git and GitHub | Version control and source hosting |
| GitHub Actions | Automated Terraform validation |

## 4. System Architecture

```text
Student / User
      |
      v
Web Browser
HTML, CSS, JavaScript
      |
      v
Cloudflare Workers URL
      |
      +----------------------+
      |                      |
      v                      v
Static Assets             REST API
HTML/CSS/JS               Cloudflare Worker
                             |
                             v
                      Cloudflare Workers KV
                         Task Data Storage

Infrastructure Management:
Terraform -> Cloudflare Resources

Continuous Integration:
GitHub -> GitHub Actions -> Terraform Validation
```

## 5. Application Features

- Create tasks with a title and description.
- Retrieve and display saved tasks.
- Retrieve an individual task through the API.
- Update task details and completion status.
- Delete tasks.
- Persist task data in Cloudflare Workers KV.
- Access the application through a public Cloudflare Workers URL.

## 6. Infrastructure as Code

Terraform configuration is stored in the `terraform/` directory.

The configuration manages these resources:

- Workers KV namespace for task storage.
- Cloudflare Worker for application logic and frontend assets.
- Workers subdomain for public access through `workers.dev`.

Terraform makes infrastructure configuration repeatable and version-controlled.

## 7. Project Structure

```text
student-task-manager-iac/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── application/
│   ├── worker.js
│   └── public/
│       ├── index.html
│       ├── style.css
│       └── script.js
├── terraform/
│   ├── main.tf
│   ├── providers.tf
│   ├── variables.tf
│   └── outputs.tf
├── .gitignore
└── README.md
```

## 8. Live Application and Source Code

**Live application:**  
https://student-task-manager.kishorgade214.workers.dev

**GitHub repository:**  
https://github.com/omgade52/student-task-manager-iac

## 9. Prerequisites

- Git
- Terraform CLI
- A Cloudflare account
- A Cloudflare API token with the required permissions
- A Cloudflare account ID
- A GitHub account

## 10. Configure Credentials

Set your credentials in PowerShell. Replace the placeholders locally. Never commit real credentials to Git.

```powershell
$env:CLOUDFLARE_API_TOKEN = "YOUR_CLOUDFLARE_API_TOKEN"
$env:TF_VAR_account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
```

## 11. Terraform Commands

Run these commands from the `terraform/` directory.

Initialize Terraform:

```powershell
terraform init
```

Format the configuration:

```powershell
terraform fmt
```

Validate the configuration:

```powershell
terraform validate
```

Preview infrastructure changes:

```powershell
terraform plan
```

Apply changes only after carefully reviewing the plan and confirming that the Terraform state corresponds to the existing Cloudflare resources:

```powershell
terraform apply
```

## 12. GitHub Actions

The workflow is defined in `.github/workflows/deploy.yml`.

The current workflow runs on pushes to `main` and supports manual execution.

It performs these steps:

1. Checks out the repository.
2. Sets up Terraform.
3. Initializes Terraform with backend configuration disabled.
4. Checks Terraform formatting.
5. Validates the Terraform configuration.

The current workflow provides continuous integration (CI) for Terraform validation. Automated infrastructure deployment through GitHub Actions is not enabled.

Shared Terraform state must be configured and verified before safely enabling automated infrastructure changes.

## 13. Testing

The following operations have been manually tested on the deployed application.

| Test Case | Expected Result | Status |
|---|---|---|
| Create a task | Task is created and displayed | Passed |
| Refresh the page | Saved task remains available | Passed |
| Complete a task | Completion status changes | Passed |
| Delete a task | Task is removed | Passed |
| GitHub Actions validation | Workflow completes successfully | Passed |

## 14. Security Considerations

- Never commit Cloudflare API tokens or other secrets.
- Store GitHub Actions credentials in repository secrets.
- Exclude Terraform state and state backups from version control.
- Review Terraform plans before applying changes.
- Validate incoming API data.
- Protect remote Terraform state with suitable access controls if a shared backend is configured.

## 15. Limitations and Future Scope

- Add student authentication and individual accounts.
- Add task deadlines, priorities, and categories.
- Add search, sorting, and filtering.
- Improve API validation and error handling.
- Add automated API tests.
- Configure shared remote Terraform state.
- Implement a controlled CI/CD deployment pipeline.
- Add monitoring and deployment alerts.

## 16. Conclusion

The Student Task Manager demonstrates serverless application development, cloud-based key-value storage, Infrastructure as Code, version control, and automated configuration validation.

The application is deployed on Cloudflare Workers, task data is stored in Workers KV, Terraform manages the cloud resources, and GitHub Actions validates the Terraform configuration.

The project provides practical experience with cloud infrastructure management and the foundations of a DevOps workflow.
'@ | Set-Content -Path .\README.md -Encoding utf8
