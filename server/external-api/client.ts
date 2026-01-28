/**
 * API客户端 - 基于原生fetch
 * 统一处理后端API请求和响应
 */

import '@/lib/polyfill';

// ============================================
// 类型定义
// ============================================

import { authClient } from '@lib/betterAuthClient';
import { env } from '@lib/env';

/**
 * API错误类
 */
export class ApiError extends Error {
  code: number;
  status?: number;

  constructor(message: string, code: number, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// ============================================
// 用户认证相关类型
// ============================================

export type User = {
  id: string;
  email: string;
  username: string;
  user_type: string;
  is_active: boolean;
  is_verified: boolean;
  credits_balance: number;
  avatar_url?: string;
  create_time: string;
}

export type LoginRequest = {
  email: string;
  password?: string;
  provider?: string;
  id_token?: string;
}

export type RegisterRequest = {
  email: string;
  password?: string;
  username?: string;
}

export type LoginResponse = {
  access_token: string;
  token_type: string;
}

export type APIKey = {
  id: string;
  name: string;
  key_prefix: string;
  api_key?: string; // 只在创建时返回
  enabled_modules: string[];
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
  is_active: boolean;
}

export type CreateAPIKeyRequest = {
  name: string;
  enabled_modules?: string[];
  expires_at?: string;
}

export type ListAPIKeysResponse = {
  api_keys: APIKey[];
  total: number;
}

// ============================================
// 订阅和计费相关类型
// ============================================

export type Subscription = {
  id: string;
  plan_type: 'free' | 'plus' | 'pro';
  status: 'active' | 'canceled' | 'past_due';
  start_date: string;
  end_date?: string;
  credits_limit: number;
  stripe_subscription_id?: string;
}

export type CreditPackage = {
  id: string;
  amount: number;
  expires_at: string;
  status: 'active' | 'expired';
  purchase_date: string;
}

export type SubscriptionPlan = {
  id: string;
  plan_id: string;
  price_id?: string;
  name: string;
  price?: number;
  period?: string;
  credits?: number;
  features: string[];
  popular: boolean;
  stripe_price_id?: string;
  description?: string;
  amount_cents?: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export type CreditsPackage = {
  id: string;
  plan_id: string;
  price_id: string;
  name: string;
  description?: string;
  credits_amount: number;
  amount_cents: number;
  currency: string;
  metadata?: Record<string, any>;
}

export type PriceConfigsResponse = {
  subscriptions: SubscriptionPlan[];
  credits_packages: CreditsPackage[];
}

export type CreditPackagePurchase = {
  credits_amount: number;
  amount_cny: number;
  payment_method_id?: string;
}

export type CheckoutSessionResponse = {
  checkout_url: string;
  session_id: string;
}

export type PaymentIntentResponse = {
  client_secret: string;
  payment_intent_id: string;
}

// ============================================
// 统一任务相关类型（符合PRD规范）
// ============================================

export type ParsingParams = {
  [key: string]: any;
}

export type JobCreate = {
  source_type: string;
  file?: any; // Use any instead of File to avoid server-side ReferenceError
  file_name?: string;
  url?: string;
  text?: string;
  data_id?: string;
  parsing_params?: ParsingParams;
  webhook?: {
    url: string;
    secret: string;
  };
  webhook_url?: string;
  result_mode?: 'auto' | 'inline' | 'url';
  options?: Record<string, any>;
}

export type JobResponse = {
  job_id: string;
  status: string;
  source_type: string;
  data_id?: string;
  created_at: string;
  result_mode: 'auto' | 'inline' | 'url';

  // New flattened fields from API
  file_name?: string;
  file_extension?: string;
  model?: string;
  ocr_enabled?: boolean;
  duration_seconds?: number;
  credits_spent?: number;
  result_url_expires_at?: string;

  // waiting-file status specific
  upload_url?: string;
  upload_headers?: Record<string, string>;
  expires_in?: number;

  // running状态特有字段
  progress?: Record<string, any>;

  // done状态特有字段
  result?: Record<string, any>;
  result_url?: string;
  result_metadata?: Record<string, any>;

  // failed状态特有字段
  error?: Record<string, any>;
}

export type JobStatus = {
  job_id: string;
  status: string;
  source_type: string;
  data_id?: string;
  created_at: string;
  updated_at?: string;
  result_mode: 'auto' | 'inline' | 'url';

  // 状态相关字段
  current_state?: string;
  progress?: Record<string, any>;
  error?: Record<string, any>;

  // 结果相关字段
  result?: Record<string, any>;
  result_url?: string;
  result_metadata?: Record<string, any>;

  // 元数据
  file_path?: string;
  s3_key?: string;
  webhook_url?: string;
  webhook_enabled: boolean;
}

export type JobList = {
  jobs: JobResponse[];
  total: number;
  page: number;
  page_size: number;
}

export type CreditsBalance = {
  [key: string]: any;
}

export type ParseUsageResponse = {
  request_total: number;
  mom_growth: number;
  credits_used: number;
  estimated_amount: number;
  success_rate: number;
  avg_processing_time: number;
}

export type UsageStats = {
  [key: string]: any;
}

export type Transaction = {
  [key: string]: any;
}

// ============================================
// 核心API客户端类
// ============================================

export class KnowhereAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor(token?: string | null) {
    // Determine base URL
    // In browser environment, use relative path '/api' to leverage Next.js proxy and avoid CORS
    if (typeof window !== 'undefined') {
      this.baseUrl = '/api';
    } else {
      // In server environment (SSR), use the full URL
      this.baseUrl = env.NEXT_PUBLIC_API_URL;
    }

    // Set token from parameter (for server-side usage) or localStorage (for client-side)
    if (token !== undefined) {
      this.token = token;
    } else if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * 更新token
   */
  updateToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  /**
   * 验证token格式
   */
  private isValidToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // JWT token通常包含三个部分，用.分隔
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // 检查每个部分是否都是有效的base64
    try {
      parts.forEach((part) => {
        if (part.length === 0) throw new Error('Empty part');
        // 简单的base64检查
        atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 统一的fetch请求封装
   */
  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // 构建请求头
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // 只有在没有设置Content-Type且不是FormData时才设置默认的Content-Type
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // 添加Accept-Language header
    if (typeof window !== 'undefined' && !headers['Accept-Language']) {
      // 尝试从cookie获取NEXT_LOCALE
      const match = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/);
      const locale = match ? match[2] : navigator.language;
      headers['Accept-Language'] = locale;
    }

    // 添加Authorization header（如果有token）
    if (this.token) {
      // 验证token格式
      if (!this.isValidToken(this.token)) {
        console.warn('Invalid token format, clearing token');
        this.updateToken(null);
        throw new ApiError('Token格式无效，请重新登录', 401);
      }
      headers.Authorization = `Bearer ${this.token}`;
    }

    // 发送请求
    try {
      const method = options.method || 'GET';
      // console.log(`[API Request] ${method} ${url}`, {
      //   hasToken: !!this.token,
      //   tokenPrefix: this.token ? this.token.substring(0, 10) : 'null',
      //   headers: headers
      // })

      const response = await fetch(url, {
        ...options,
        headers,
        cache: options.cache || 'no-store', // 默认不缓存
      });

      // 解析响应
      const result = await response.json();

      // 检查HTTP状态码
      if (!response.ok) {
        // 如果是401错误，清除本地token
        if (response.status === 401) {
          console.warn('收到401响应，清除本地token并退出');
          this.updateToken(null);

          if (typeof window !== 'undefined') {
            // 清除其他可能存在的用户数据
            localStorage.removeItem('user_data');

            // 尝试清除 Better Auth Session，防止中间件死循环重定向
            try {
              await authClient.signOut();
            } catch (e) {
              console.error('Failed to sign out from Better Auth:', e);
            }

            // 可以在这里触发一个自定义事件，通知应用层进行跳转，或者直接刷新/跳转
            // 为了安全起见，简单地刷新页面或跳转到登录页通常是最好的
            // 这里假设应用有一个 /login 路由
            // 使用 window.location.href 会导致全页面刷新，这对于清除状态是好的
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login?expired=true';
            }
          }
        }

        throw new ApiError(
          result.detail || result.msg || `HTTP错误: ${response.status}`,
          result.code || response.status,
          response.status,
        );
      }

      // 直接返回结果，不再检查ResponseResult格式
      return result;
    } catch (error) {
      // 网络错误或其他异常
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(error.message, 500);
      }

      throw new ApiError('未知错误', 500);
    }
  }

  /**
   * GET请求
   */
  private async get<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST请求
   */
  private async post<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: isFormData
        ? options?.headers
        : { 'Content-Type': 'application/json', ...options?.headers },
      body: isFormData ? data : JSON.stringify(data),
    });
  }

  /**
   * PUT请求
   */
  private async put<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE请求
   */
  private async delete<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH请求
   */
  private async patch<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============================================
  // 认证与用户API
  // ============================================

  /**
   * 用户登录
   */
  async login(data: LoginRequest) {
    const formData = new URLSearchParams();
    formData.append('username', data.email);
    if (data.password) formData.append('password', data.password);

    return this.request<LoginResponse>('/v1/jwt/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
  }

  /**
   * 用户注册
   */
  async register(data: RegisterRequest) {
    return this.post<User>('/v1/register', data);
  }

  /**
   * 获取当前用户信息
   */
  async getUserProfile(options?: RequestInit) {
    return this.get<User>('/v1/me', options);
  }

  /**
   * 更新用户信息
   */
  async updateUserProfile(data: Partial<User>) {
    return this.patch<User>('/v1/users/me', data);
  }

  /**
   * 修改密码
   */
  async changePassword(data: any) {
    return this.post('/v1/users/set_password', data);
  }

  // ============================================
  // 计费管理API
  // ============================================

  /**
   * 获取Credits余额
   */
  async getCreditsBalance() {
    return this.get<CreditsBalance>('/v1/billing/credits');
  }

  /**
   * 获取解析用量
   */
  async getParseUsage() {
    return this.get<ParseUsageResponse>('/v1/billing/parse-usage');
  }

  /**
   * 购买Credits
   */
  async buyCredits(amount: number) {
    return this.post<CheckoutSessionResponse>('/v1/billing/buy-credits', {
      credits_amount: amount,
    });
  }

  /**
   * 订阅计划
   */
  async subscribePlan(planId: string) {
    return this.post<CheckoutSessionResponse>('/v1/billing/subscribe', {
      plan_id: planId,
    });
  }

  /**
   * 获取当前订阅信息
   */
  async getCurrentSubscription() {
    return this.get<Subscription>('/v1/billing/subscription');
  }

  /**
   * 获取价格配置列表
   */
  async getPriceConfigs(productType?: 'subscription' | 'credits_package') {
    const params = productType ? `?product_type=${productType}` : '';
    return this.get<PriceConfigsResponse>(`/v1/billing/price-configs${params}`);
  }

  /**
   * 通过价格ID购买Credits包
   */
  async buyCreditsPackage(priceId: string, quantity: number) {
    return this.post<CheckoutSessionResponse>('/v1/billing/buy-credits-package', {
      price_id: priceId,
      quantity,
    });
  }

  /**
   * 取消订阅
   */
  async cancelSubscription() {
    return this.post('/v1/billing/cancel-subscription');
  }

  /**
   * 获取Credits量包列表
   */
  async getCreditPackages() {
    return this.get<CreditPackage[]>('/v1/billing/credit-packages');
  }

  /**
   * 获取使用统计
   */
  async getUsageStats(period = 'month') {
    return this.get<UsageStats>(`/v1/billing/usage?period=${period}`);
  }

  /**
   * 获取交易历史
   */
  async getTransactionHistory(limit = 50, offset = 0) {
    return this.get<{ transactions: Transaction[]; total: number }>(
      `/v1/user/credits/transactions?limit=${limit}&offset=${offset}`,
    );
  }

  // ============================================
  // 统一任务API
  // ============================================

  // --- API Key Management ---

  /**
   * 获取 API Key 列表
   */
  async listApiKeys(options?: RequestInit) {
    return this.get<ListAPIKeysResponse>('/v1/auth/list', options);
  }

  /**
   * 创建 API Key
   */
  async createApiKey(data: CreateAPIKeyRequest) {
    return this.post<APIKey>('/v1/auth/create', data);
  }

  /**
   * 删除 API Key
   */
  async deleteApiKey(id: string) {
    // 使用 POST /v1/auth/revoke 撤销 API Key
    return this.post('/v1/auth/revoke', { api_key_id: id });
  }

  /**
   * 撤销 API Key (别名)
   */
  async revokeApiKey(id: string) {
    return this.deleteApiKey(id);
  }

  /**
   * 更新 API Key 状态
   */
  async updateApiKey(id: string, data: { is_active?: boolean; name?: string }) {
    return this.post<APIKey>('/v1/auth/update', { api_key_id: id, ...data });
  }

  /**
   * 切换 API Key 状态
   */
  async toggleApiKey(id: string) {
    return this.put<APIKey>(`/v1/auth/${id}/toggle`);
  }

  // --- End API Key Management ---

  /**
   * 创建任务
   */
  async createJob(data: JobCreate) {
    // 如果包含文件对象，不需要在这里发送，因为会有专门的上传流程
    // 这里只需要发送元数据
    const { file, ...jobData } = data;
    return this.post<JobResponse>('/v1/jobs', jobData);
  }

  /**
   * 确认上传完成
   */
  async confirmUpload(jobId: string) {
    return this.post<JobResponse>(`/v1/jobs/${jobId}/confirm-upload`);
  }

  /**
   * 获取任务状态
   */
  async getJobStatus(jobId: string) {
    return this.get<JobStatus>(`/v1/jobs/${jobId}`);
  }

  /**
   * 获取任务列表
   */
  async listJobs(params?: {
    page?: number;
    page_size?: number;
    status?: string;
    job_type?: string;
    recent_days?: 1 | 7 | 30;
    start_time?: string;
    end_time?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.status) queryParams.append('status', params.status);

    // Add default job_type=kb_management if not specified, as requested
    // const jobType = params?.job_type || 'kb_management'
    // queryParams.append('job_type', jobType)

    // New filtering parameters
    if (params?.recent_days) queryParams.append('recent_days', params.recent_days.toString());
    if (params?.start_time) queryParams.append('start_time', params.start_time);
    if (params?.end_time) queryParams.append('end_time', params.end_time);

    const query = queryParams.toString();
    return this.get<JobList>(`/v1/jobs/page${query ? `?${query}` : ''}`);
  }

  /**
   * 直接上传文件到S3预签名URL
   */
  async uploadFileToS3(
    uploadUrl: string,
    file: any, // Use any instead of File to avoid server-side ReferenceError
    headers: Record<string, string>,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 监听上传进度
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      // 监听完成事件
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      // 监听错误事件
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      // 监听超时事件
      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timed out'));
      });

      // 设置超时时间（5分钟）
      xhr.timeout = 5 * 60 * 1000;

      // 开始上传
      xhr.open('PUT', uploadUrl);

      // 设置请求头
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.send(file);
    });
  }

  // ============================================
}

// 导出单例实例
export const api = new KnowhereAPI();
