export interface User {
    _id: string
    email: string,
    password: string,
    subscription: any,
    subscriptionStartDate: any,
    nextPaymentDate: string,
    recentSearches: Array<any>,
    recurringRevenue: number,
    thisMonthRevenue: number,
    influencersEmailViewed: Array<string>,
    influencersEmailViewedCount: number,
    totalClients: number, 
    newClients: number,
    admin: boolean,
    avatar: string,
    stripeSessionId: string;
    stripeSubscriptionId: string;
    tempViewLimit: number;
}
export interface LoginPayLoad {
    email: string,
    password: string
}

export interface RegisterPayLoad {
    name: string,
    email: string,
    password: string
}

export interface ApiResponse<T> {
    status?: boolean,
    message?: string,
    error?: string,
    data: T
}