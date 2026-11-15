import { 
  users, households, householdMembers, zones, taskTemplates, tasks, taskCompletions,
  type User, type InsertUser, type Household, type InsertHousehold, 
  type HouseholdMember, type InsertHouseholdMember, type Zone, type InsertZone,
  type TaskTemplate, type InsertTaskTemplate, type Task, type InsertTask,
  type TaskCompletion, type InsertTaskCompletion
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Household methods
  getHousehold(id: number): Promise<Household | undefined>;
  getHouseholdByInviteCode(inviteCode: string): Promise<Household | undefined>;
  createHousehold(household: InsertHousehold): Promise<Household>;
  updateHousehold(id: number, updates: Partial<Household>): Promise<Household | undefined>;

  // Household member methods
  getHouseholdMembers(householdId: number): Promise<(HouseholdMember & { user: User })[]>;
  addHouseholdMember(member: InsertHouseholdMember): Promise<HouseholdMember>;
  removeHouseholdMember(householdId: number, userId: number): Promise<boolean>;

  // Zone methods
  getZone(id: number): Promise<Zone | undefined>;
  getZonesByHousehold(householdId: number): Promise<Zone[]>;
  createZone(zone: InsertZone): Promise<Zone>;
  updateZone(id: number, updates: Partial<Zone>): Promise<Zone | undefined>;
  deleteZone(id: number): Promise<boolean>;

  // Task template methods
  getTaskTemplate(id: number): Promise<TaskTemplate | undefined>;
  getTaskTemplates(householdId?: number): Promise<TaskTemplate[]>;
  createTaskTemplate(template: InsertTaskTemplate): Promise<TaskTemplate>;
  updateTaskTemplate(id: number, updates: Partial<TaskTemplate>): Promise<TaskTemplate | undefined>;
  deleteTaskTemplate(id: number): Promise<boolean>;

  // Task methods
  getTask(id: number): Promise<Task | undefined>;
  getTasksByHousehold(householdId: number): Promise<(Task & { template: TaskTemplate; zone: Zone; assignedUser?: User })[]>;
  getTasksDueByDate(householdId: number, date: Date): Promise<(Task & { template: TaskTemplate; zone: Zone; assignedUser?: User })[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Task completion methods
  getTaskCompletion(id: number): Promise<TaskCompletion | undefined>;
  getTaskCompletions(taskId: number): Promise<(TaskCompletion & { user: User })[]>;
  createTaskCompletion(completion: InsertTaskCompletion): Promise<TaskCompletion>;

  // Analytics methods
  getCompletionStats(householdId: number, period: string): Promise<any>;
  getOverdueTasks(householdId: number): Promise<(Task & { template: TaskTemplate; zone: Zone })[]>;
  getMemberPerformance(householdId: number): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private households: Map<number, Household>;
  private householdMembers: Map<number, HouseholdMember>;
  private zones: Map<number, Zone>;
  private taskTemplates: Map<number, TaskTemplate>;
  private tasks: Map<number, Task>;
  private taskCompletions: Map<number, TaskCompletion>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.households = new Map();
    this.householdMembers = new Map();
    this.zones = new Map();
    this.taskTemplates = new Map();
    this.tasks = new Map();
    this.taskCompletions = new Map();
    this.currentId = 1;
    
    this.seedDefaultData();
    this.seedPredefinedTasks();
    this.seedDefaultZones();
  }

  private seedDefaultData() {
    // Create default user (Shaun)
    const defaultUser: User = {
      id: this.currentId++,
      firebaseUid: 'shaun-user-123',
      email: 'shaun@example.com',
      name: 'Shaun',
      phone: null,
      notificationPreferences: {},
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create default household
    const defaultHousehold: Household = {
      id: this.currentId++,
      name: 'Barry Family',
      inviteCode: 'DEMO123',
      createdBy: defaultUser.id,
      createdAt: new Date(),
    };
    this.households.set(defaultHousehold.id, defaultHousehold);

    // Add user to household
    const membership: HouseholdMember = {
      id: this.currentId++,
      householdId: defaultHousehold.id,
      userId: defaultUser.id,
      role: 'admin',
      joinedAt: new Date(),
    };
    this.householdMembers.set(membership.id, membership);
  }

  private seedPredefinedTasks() {
    const predefinedTasks = [
      { name: "Clean toilets", category: "cleaning", defaultFrequency: "weekly", estimatedDuration: 15 },
      { name: "Vacuum carpets", category: "cleaning", defaultFrequency: "weekly", estimatedDuration: 30 },
      { name: "Mop floors", category: "cleaning", defaultFrequency: "weekly", estimatedDuration: 25 },
      { name: "Clean kitchen counters", category: "cleaning", defaultFrequency: "daily", estimatedDuration: 10 },
      { name: "Clean microwave", category: "cleaning", defaultFrequency: "weekly", estimatedDuration: 15 },
      { name: "Dust light fixtures", category: "cleaning", defaultFrequency: "monthly", estimatedDuration: 20 },
      { name: "Clean baseboards", category: "cleaning", defaultFrequency: "monthly", estimatedDuration: 45 },
      { name: "Wash windows", category: "cleaning", defaultFrequency: "monthly", estimatedDuration: 60 },
      { name: "Change furnace filter", category: "maintenance", defaultFrequency: "every 3 months", estimatedDuration: 10 },
      { name: "Test smoke detectors", category: "maintenance", defaultFrequency: "monthly", estimatedDuration: 15 },
      { name: "Clean gutters", category: "maintenance", defaultFrequency: "every 6 months", estimatedDuration: 120 },
      { name: "Mow lawn", category: "yardwork", defaultFrequency: "weekly", estimatedDuration: 60 },
      { name: "Water plants", category: "yardwork", defaultFrequency: "daily", estimatedDuration: 15 },
      { name: "Weed flower beds", category: "yardwork", defaultFrequency: "weekly", estimatedDuration: 45 },
      { name: "Winterize outdoor faucets", category: "seasonal", defaultFrequency: "yearly", estimatedDuration: 30 },
    ];

    predefinedTasks.forEach(task => {
      const template: TaskTemplate = {
        id: this.currentId++,
        name: task.name,
        category: task.category as any,
        defaultFrequency: task.defaultFrequency,
        estimatedDuration: task.estimatedDuration,
        description: null,
        isCustom: false,
        householdId: null,
        createdAt: new Date(),
      };
      this.taskTemplates.set(template.id, template);
    });
  }

  private seedDefaultZones() {
    const defaultZones = [
      { name: 'Kitchen', type: 'indoor' },
      { name: 'Living Room', type: 'indoor' },
      { name: 'Master Bedroom', type: 'indoor' },
      { name: 'Guest Bedroom', type: 'indoor' },
      { name: 'Master Bathroom', type: 'indoor' },
      { name: 'Guest Bathroom', type: 'indoor' },
      { name: 'Dining Room', type: 'indoor' },
      { name: 'Home Office', type: 'indoor' },
      { name: 'Laundry Room', type: 'indoor' },
      { name: 'Garage', type: 'indoor' },
      { name: 'Front Yard', type: 'outdoor' },
      { name: 'Back Yard', type: 'outdoor' },
      { name: 'Front Porch', type: 'outdoor' },
      { name: 'Back Patio', type: 'outdoor' },
      { name: 'Driveway', type: 'outdoor' },
    ];

    defaultZones.forEach((zone) => {
      const zoneData: Zone = {
        id: this.currentId++,
        householdId: 2, // Default household ID
        name: zone.name,
        type: zone.type,
        parentZoneId: null,
        isCustom: false,
        createdAt: new Date(),
      };
      this.zones.set(zoneData.id, zoneData);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === firebaseUid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser,
      id,
      phone: insertUser.phone ?? null,
      notificationPreferences: insertUser.notificationPreferences ?? null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Household methods
  async getHousehold(id: number): Promise<Household | undefined> {
    return this.households.get(id);
  }

  async getHouseholdByInviteCode(inviteCode: string): Promise<Household | undefined> {
    return Array.from(this.households.values()).find(h => h.inviteCode === inviteCode);
  }

  async createHousehold(insertHousehold: InsertHousehold): Promise<Household> {
    const id = this.currentId++;
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const household: Household = { 
      ...insertHousehold, 
      id,
      inviteCode,
      createdAt: new Date()
    };
    this.households.set(id, household);
    return household;
  }

  async updateHousehold(id: number, updates: Partial<Household>): Promise<Household | undefined> {
    const household = this.households.get(id);
    if (!household) return undefined;
    
    const updatedHousehold = { ...household, ...updates };
    this.households.set(id, updatedHousehold);
    return updatedHousehold;
  }

  // Household member methods
  async getHouseholdMembers(householdId: number): Promise<(HouseholdMember & { user: User })[]> {
    const members = Array.from(this.householdMembers.values())
      .filter(member => member.householdId === householdId);
    
    return members.map(member => {
      const user = this.users.get(member.userId);
      return { ...member, user: user! };
    }).filter(member => member.user);
  }

  async addHouseholdMember(insertMember: InsertHouseholdMember): Promise<HouseholdMember> {
    const id = this.currentId++;
    const member: HouseholdMember = { 
      ...insertMember,
      id,
      role: insertMember.role ?? 'member',
      joinedAt: new Date()
    };
    this.householdMembers.set(id, member);
    return member;
  }

  async removeHouseholdMember(householdId: number, userId: number): Promise<boolean> {
    const member = Array.from(this.householdMembers.values())
      .find(m => m.householdId === householdId && m.userId === userId);
    
    if (!member) return false;
    
    return this.householdMembers.delete(member.id);
  }

  // Zone methods
  async getZone(id: number): Promise<Zone | undefined> {
    return this.zones.get(id);
  }

  async getZonesByHousehold(householdId: number): Promise<Zone[]> {
    const zones = Array.from(this.zones.values())
      .filter(zone => zone.householdId === householdId || zone.householdId === 1);
    return zones;
  }

  async createZone(insertZone: InsertZone): Promise<Zone> {
    const id = this.currentId++;
    const zone: Zone = { 
      id,
      name: insertZone.name,
      type: insertZone.type,
      householdId: insertZone.householdId,
      parentZoneId: insertZone.parentZoneId ?? null,
      isCustom: insertZone.isCustom ?? true,
      createdAt: new Date()
    };
    this.zones.set(id, zone);
    return zone;
  }

  async updateZone(id: number, updates: Partial<Zone>): Promise<Zone | undefined> {
    const zone = this.zones.get(id);
    if (!zone) return undefined;
    
    const updatedZone = { ...zone, ...updates };
    this.zones.set(id, updatedZone);
    return updatedZone;
  }

  async deleteZone(id: number): Promise<boolean> {
    return this.zones.delete(id);
  }

  // Task template methods
  async getTaskTemplate(id: number): Promise<TaskTemplate | undefined> {
    return this.taskTemplates.get(id);
  }

  async getTaskTemplates(householdId?: number): Promise<TaskTemplate[]> {
    return Array.from(this.taskTemplates.values())
      .filter(template => template.householdId === householdId || template.householdId === null);
  }

  async createTaskTemplate(insertTemplate: InsertTaskTemplate): Promise<TaskTemplate> {
    const id = this.currentId++;
    const template: TaskTemplate = { 
      ...insertTemplate,
      id,
      householdId: insertTemplate.householdId ?? null,
      isCustom: insertTemplate.isCustom ?? true,
      description: insertTemplate.description ?? null,
      createdAt: new Date()
    };
    this.taskTemplates.set(id, template);
    return template;
  }

  async updateTaskTemplate(id: number, updates: Partial<TaskTemplate>): Promise<TaskTemplate | undefined> {
    const template = this.taskTemplates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate = { ...template, ...updates };
    this.taskTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTaskTemplate(id: number): Promise<boolean> {
    return this.taskTemplates.delete(id);
  }

  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByHousehold(householdId: number): Promise<(Task & { template: TaskTemplate; zone: Zone; assignedUser?: User })[]> {
    const householdTasks = Array.from(this.tasks.values())
      .filter(task => task.householdId === householdId);
    
    const enrichedTasks = householdTasks.map(task => {
      const template = this.taskTemplates.get(task.templateId);
      const zone = this.zones.get(task.zoneId);
      
      return {
        ...task,
        template: template!,
        zone: zone!,
        assignedUser: task.assignedTo ? this.users.get(task.assignedTo) : undefined
      };
    }).filter(task => task.template && task.zone);
    
    return enrichedTasks;
  }

  async getTasksDueByDate(householdId: number, date: Date): Promise<(Task & { template: TaskTemplate; zone: Zone; assignedUser?: User })[]> {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const dueTasks = Array.from(this.tasks.values())
      .filter(task => 
        task.householdId === householdId && 
        task.isActive &&
        new Date(task.nextDue) <= endOfDay
      );
    
    return dueTasks.map(task => ({
      ...task,
      template: this.taskTemplates.get(task.templateId)!,
      zone: this.zones.get(task.zoneId)!,
      assignedUser: task.assignedTo ? this.users.get(task.assignedTo) : undefined
    })).filter(task => task.template && task.zone);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    
    // Auto-assign to the only household member if no assignment is specified
    let assignedTo = insertTask.assignedTo;
    if (!assignedTo) {
      const householdMembers = await this.getHouseholdMembers(insertTask.householdId);
      if (householdMembers.length === 1) {
        assignedTo = householdMembers[0].userId; // Assign to Shaun (the only member)
      }
    }
    
    const task: Task = { 
      ...insertTask,
      id,
      assignedTo: assignedTo ?? null,
      customInterval: insertTask.customInterval ?? null,
      lastCompleted: insertTask.lastCompleted ?? null,
      isActive: insertTask.isActive ?? true,
      notes: insertTask.notes ?? null,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Task completion methods
  async getTaskCompletion(id: number): Promise<TaskCompletion | undefined> {
    return this.taskCompletions.get(id);
  }

  async getTaskCompletions(taskId: number): Promise<(TaskCompletion & { user: User })[]> {
    const completions = Array.from(this.taskCompletions.values())
      .filter(completion => completion.taskId === taskId);
    
    return completions.map(completion => {
      const user = this.users.get(completion.completedBy);
      return { ...completion, user: user! };
    }).filter(completion => completion.user);
  }

  async createTaskCompletion(insertCompletion: InsertTaskCompletion): Promise<TaskCompletion> {
    const id = this.currentId++;
    const completion: TaskCompletion = { 
      ...insertCompletion,
      id,
      notes: insertCompletion.notes ?? null,
      completedAt: new Date()
    };
    this.taskCompletions.set(id, completion);
    return completion;
  }

  // Analytics methods
  async getCompletionStats(householdId: number, period: string): Promise<any> {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const householdTasks = Array.from(this.tasks.values())
      .filter(task => task.householdId === householdId);
    
    const completions = Array.from(this.taskCompletions.values())
      .filter(completion => 
        householdTasks.some(task => task.id === completion.taskId) &&
        completion.completedAt >= startDate
      );

    return {
      totalTasks: householdTasks.length,
      completedTasks: completions.length,
      completionRate: householdTasks.length > 0 ? (completions.length / householdTasks.length) * 100 : 0
    };
  }

  async getOverdueTasks(householdId: number): Promise<(Task & { template: TaskTemplate; zone: Zone })[]> {
    const now = new Date();
    const overdueTasks = Array.from(this.tasks.values())
      .filter(task => 
        task.householdId === householdId && 
        task.isActive &&
        new Date(task.nextDue) < now
      );
    
    return overdueTasks.map(task => ({
      ...task,
      template: this.taskTemplates.get(task.templateId)!,
      zone: this.zones.get(task.zoneId)!
    })).filter(task => task.template && task.zone);
  }

  async getMemberPerformance(householdId: number): Promise<any[]> {
    const members = await this.getHouseholdMembers(householdId);
    const householdTasks = Array.from(this.tasks.values())
      .filter(task => task.householdId === householdId);
    
    return members.map(member => {
      const assignedTasks = householdTasks.filter(task => task.assignedTo === member.userId);
      const completions = Array.from(this.taskCompletions.values())
        .filter(completion => 
          completion.completedBy === member.userId &&
          householdTasks.some(task => task.id === completion.taskId)
        );

      return {
        user: member.user,
        assignedTasks: assignedTasks.length,
        completedTasks: completions.length,
        completionRate: assignedTasks.length > 0 ? (completions.length / assignedTasks.length) * 100 : 0
      };
    });
  }
}

export const storage = new MemStorage();
