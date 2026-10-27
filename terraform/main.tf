
resource "cloudflare_workers_kv_namespace" "tasks" {
  account_id = var.account_id
  title      = "student-task-manager-tasks"
}

resource "cloudflare_workers_script" "task_manager" {
  account_id         = var.account_id
  script_name        = "student-task-manager"
  content            = file("${path.module}/../application/worker.js")
  compatibility_date = "2026-10-27"
  main_module        = "worker.js"

  assets = {
    directory = "${path.module}/../application/public"

    config = {
      run_worker_first = ["/api/*"]
    }
  }

  bindings = [
    {
      name         = "TASKS"
      type         = "kv_namespace"
      namespace_id = cloudflare_workers_kv_namespace.tasks.id
    }
  ]
}

resource "cloudflare_workers_script_subdomain" "task_manager" {
  account_id  = var.account_id
  script_name = cloudflare_workers_script.task_manager.script_name
  enabled     = true
}
