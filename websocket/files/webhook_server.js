import express from "express";

const PORT = process.env.WEBHOOK_PORT ?? 55555;

class WebhookService {
  app = null;
  subs = [];

  constructor() {
    this.app = express();
    this.app.listen(PORT, () => {
      console.log(`WEBHOOK SERVER UP at 0.0.0.0:${PORT}`);
    });

    this.app.get("/", async (req, res) => {
      res.status(200);
      res.end();
    });

    this.app.get("/update_plants", async (req, res) => {
      await this.callHookSubs("update", "plants");
      res.status(200);
      res.end();
    });

    this.app.get("/update_users", async (req, res) => {
      await this.callHookSubs("update", "users");
      res.status(200);
      res.end();
    });
  }

  async callHookSubs(type, target) {
    let subArr = this.subs;

    for (const subCallback of subArr) {
      subCallback({ type, target });
    }
  }

  onUpdate(callback) {
    this.subs.push(callback);
  }
}

const webhookService = new WebhookService();

export default webhookService;
