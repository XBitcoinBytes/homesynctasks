import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertHouseholdSchema, insertZoneSchema, insertTaskTemplateSchema, insertTaskSchema, insertTaskCompletionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/firebase/:firebaseUid", async (req, res) => {
    try {
      const firebaseUid = req.params.firebaseUid;
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Household routes
  app.get("/api/households/:id", async (req, res) => {
    try {
      const householdId = parseInt(req.params.id);
      const household = await storage.getHousehold(householdId);
      
      if (!household) {
        return res.status(404).json({ message: "Household not found" });
      }
      
      res.json(household);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/households/invite/:inviteCode", async (req, res) => {
    try {
      const inviteCode = req.params.inviteCode;
      const household = await storage.getHouseholdByInviteCode(inviteCode);
      
      if (!household) {
        return res.status(404).json({ message: "Invalid invite code" });
      }
      
      res.json(household);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/households", async (req, res) => {
    try {
      const householdData = insertHouseholdSchema.parse(req.body);
      const household = await storage.createHousehold(householdData);
      res.status(201).json(household);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid household data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/households/:householdId/members", async (req, res) => {
    try {
      const householdId = parseInt(req.params.householdId);
      const members = await storage.getHouseholdMembers(householdId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/household-members", async (req, res) => {
    try {
      const memberData = req.body;
      const member = await storage.addHouseholdMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Zone routes
  app.get("/api/households/:householdId/zones", async (req, res) => {
    try {
      const householdId = parseInt(req.params.householdId);
      const zones = await storage.getZonesByHousehold(householdId);
      res.json(zones);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Zone routes
  app.get("/api/zones", async (req, res) => {
    try {
      const householdId = req.query.householdId ? parseInt(req.query.householdId as string) : undefined;
      const zones = await storage.getZonesByHousehold(householdId || 1);
      res.json(zones);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/zones", async (req, res) => {
    try {
      console.log("Zone creation request body:", req.body);
      const zoneData = insertZoneSchema.parse(req.body);
      console.log("Parsed zone data:", zoneData);
      const zone = await storage.createZone(zoneData);
      res.status(201).json(zone);
    } catch (error) {
      console.error("Zone creation error:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid zone data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Task template routes
  app.get("/api/task-templates", async (req, res) => {
    try {
      const householdId = req.query.householdId ? parseInt(req.query.householdId as string) : undefined;
      const templates = await storage.getTaskTemplates(householdId);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/task-templates", async (req, res) => {
    try {
      const templateData = insertTaskTemplateSchema.parse(req.body);
      const template = await storage.createTaskTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task template data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Task routes
  app.get("/api/households/:householdId/tasks", async (req, res) => {
    try {
      const householdId = parseInt(req.params.householdId);
      const tasks = await storage.getTasksByHousehold(householdId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/households/:householdId/tasks/due", async (req, res) => {
    try {
      const householdId = parseInt(req.params.householdId);
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const tasks = await storage.getTasksDueByDate(householdId, date);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      // Convert string dates to Date objects
      const body = { ...req.body };
      if (body.nextDue && typeof body.nextDue === 'string') {
        body.nextDue = new Date(body.nextDue);
      }
      if (body.dueDate && typeof body.dueDate === 'string') {
        body.dueDate = new Date(body.dueDate);
      }
      
      const taskData = insertTaskSchema.parse(body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const updates = req.body;
      const task = await storage.updateTask(taskId, updates);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Task completion routes
  app.post("/api/task-completions", async (req, res) => {
    try {
      const completionData = insertTaskCompletionSchema.parse(req.body);
      const completion = await storage.createTaskCompletion(completionData);
      res.status(201).json(completion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid completion data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/tasks/:taskId/completions", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const completions = await storage.getTaskCompletions(taskId);
      res.json(completions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics routes
  app.get("/api/households/:householdId/analytics/completion-stats", async (req, res) => {
    try {
      const householdId = parseInt(req.params.householdId);
      const period = req.query.period as string || 'week';
      const stats = await storage.getCompletionStats(householdId, period);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/households/:householdId/analytics/overdue-tasks", async (req, res) => {
    try {
      const householdId = parseInt(req.params.householdId);
      const overdueTasks = await storage.getOverdueTasks(householdId);
      res.json(overdueTasks);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/households/:householdId/analytics/member-performance", async (req, res) => {
    try {
      const householdId = parseInt(req.params.householdId);
      const performance = await storage.getMemberPerformance(householdId);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Validate invitation code endpoint
  app.get("/api/validate-invite/:inviteCode", async (req, res) => {
    try {
      const { inviteCode } = req.params;
      
      const household = await storage.getHouseholdByInviteCode(inviteCode);
      if (!household) {
        return res.status(404).json({ message: "Invalid invite code" });
      }

      res.json({
        success: true,
        household: {
          id: household.id,
          name: household.name
        }
      });
    } catch (error) {
      console.error('Error validating invite:', error);
      res.status(500).json({ message: "Failed to validate invitation" });
    }
  });

  // Accept invitation and create user account
  app.post("/api/accept-invitation", async (req, res) => {
    try {
      const { inviteCode, name, email } = req.body;
      
      if (!inviteCode || !name || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Find household by invite code
      const household = await storage.getHouseholdByInviteCode(inviteCode);
      if (!household) {
        return res.status(404).json({ message: "Invalid invite code" });
      }

      // Check if user already exists
      let user = await storage.getUserByFirebaseUid(email); // Using email as temp UID
      if (!user) {
        // Create new user
        user = await storage.createUser({
          firebaseUid: email, // Using email as temp UID until proper auth
          email,
          name,
          phone: null,
          notificationPreferences: {}
        });
      }

      // Add user to household
      await storage.addHouseholdMember({
        householdId: household.id,
        userId: user.id,
        role: 'member'
      });

      res.json({
        success: true,
        message: `Successfully joined "${household.name}"`,
        user,
        household
      });
    } catch (error) {
      console.error('Error accepting invitation:', error);
      res.status(500).json({ message: "Failed to accept invitation" });
    }
  });

  // Email invitation endpoint
  app.post("/api/send-invitation", async (req, res) => {
    try {
      const { email, message, householdName, inviteCode } = req.body;
      
      if (!email || !householdName || !inviteCode) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Input validation and sanitization
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Sanitize inputs to prevent XSS
      const sanitizedMessage = message ? message.replace(/<[^>]*>/g, '') : '';
      const sanitizedHouseholdName = householdName.replace(/<[^>]*>/g, '');
      const sanitizedInviteCode = inviteCode.replace(/[^A-Z0-9]/g, '');

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const inviteUrl = `${baseUrl}?invite=${sanitizedInviteCode}`;

      // Create email content using sanitized inputs
      const emailSubject = `You're invited to join "${sanitizedHouseholdName}" on HomeSync`;
      const emailText = `
Hello!

You've been invited to join the "${sanitizedHouseholdName}" household on HomeSync - a collaborative task management app.

${sanitizedMessage ? `Personal message: ${sanitizedMessage}` : ''}

To accept this invitation and create your account:
1. Click this link: ${inviteUrl}
2. Or visit ${baseUrl} and enter invite code: ${sanitizedInviteCode}

Start collaborating on household tasks today!

Best regards,
The HomeSync Team
      `;

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .code { background: #e8f4f8; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 18px; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 HomeSync Invitation</h1>
            <p>You're invited to join "${householdName}"</p>
        </div>
        <div class="content">
            <p>Hello!</p>
            <p>You've been invited to join the <strong>"${sanitizedHouseholdName}"</strong> household on HomeSync - a collaborative task management app where families coordinate household tasks efficiently.</p>
            
            ${sanitizedMessage ? `<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;"><strong>Personal message:</strong><br>${sanitizedMessage}</div>` : ''}
            
            <p><strong>To accept this invitation and create your account:</strong></p>
            <ol>
                <li>Click the button below to join directly</li>
                <li>Or visit our app and enter the invite code</li>
            </ol>
            
            <div style="text-align: center;">
                <a href="${inviteUrl}" class="button">Accept Invitation & Create Account</a>
            </div>
            
            <div class="code">
                <strong>Invite Code:</strong> ${sanitizedInviteCode}
            </div>
            
            <p>Once you join, you'll be able to:</p>
            <ul>
                <li>View and manage household tasks</li>
                <li>Create and assign tasks to family members</li>
                <li>Track task completion and schedules</li>
                <li>Organize tasks by rooms and zones</li>
            </ul>
            
            <p>Start collaborating on household tasks today!</p>
            
            <p>Best regards,<br>The HomeSync Team</p>
        </div>
    </div>
</body>
</html>
      `;

      // Import production email service
      const { productionEmailService } = await import('./email-service.js');

      // Send email using verified sender
      const emailSent = await productionEmailService.sendInvitationEmail({
        to: email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml
      });

      if (emailSent) {
        res.json({
          success: true,
          message: `Invitation email sent successfully to ${email}`,
          details: { email, householdName, inviteCode, inviteUrl }
        });
      } else {
        // Professional fallback for reliable invitation sharing
        console.log(`📧 EMAIL INVITATION DETAILS 📧`);
        console.log(`To: ${email}`);
        console.log(`Subject: ${emailSubject}`);
        console.log(`Body: ${emailText}`);
        console.log(`Invite Code: ${inviteCode}`);
        console.log(`Household: ${householdName}`);
        console.log(`Invite URL: ${inviteUrl}`);
        console.log(`---End Email Details---`);
        
        res.json({ 
          success: true, 
          message: `Invitation created successfully. Share the invite link or code with ${email}.`,
          emailReady: true,
          details: {
            email,
            householdName: sanitizedHouseholdName,
            inviteCode: sanitizedInviteCode,
            customMessage: sanitizedMessage || null,
            subject: emailSubject,
            body: emailText,
            inviteUrl,
            shareText: `Join our household "${sanitizedHouseholdName}" on HomeSync! Use invite code: ${sanitizedInviteCode} or click: ${inviteUrl}`
          }
        });
      }
    } catch (error) {
      console.error('Error processing invitation:', error);
      res.status(500).json({ message: "Failed to process invitation" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
