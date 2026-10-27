
output "worker_name" {
  description = "Deployed Cloudflare Worker name"
  value       = cloudflare_workers_script.task_manager.script_name
}
