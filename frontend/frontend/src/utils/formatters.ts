export function formatCurrency(amount: number): string {
 return new Intl.NumberFormat('en-IN', {
 style: 'currency',
 currency: 'INR',
 maximumFractionDigits: 2,
 minimumFractionDigits: 2,
 }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
 if (amount >= 100000) {
 return `₹${(amount / 100000).toFixed(1)}L`;
 }
 if (amount >= 1000) {
 return `₹${(amount / 1000).toFixed(1)}k`;
 }
 return `₹${amount.toFixed(0)}`;
}

export function formatDate(isoString: string): string {
 try {
 const date = new Date(isoString);
 return date.toLocaleDateString('en-IN', {
 month: 'short',
 day: 'numeric',
 hour: '2-digit',
 minute: '2-digit',
 });
 } catch {
 return isoString;
 }
}

export function formatTimeAgo(isoString: string): string {
 try {
 const date = new Date(isoString);
 const now = new Date();
 const diffMs = now.getTime() - date.getTime();
 const diffSec = Math.floor(diffMs / 1000);
 const diffMin = Math.floor(diffSec / 60);
 const diffHours = Math.floor(diffMin / 60);
 const diffDays = Math.floor(diffHours / 24);

 if (diffSec < 60) return 'Just now';
 if (diffMin < 60) return `${diffMin}m ago`;
 if (diffHours < 24) return `${diffHours}h ago`;
 if (diffDays === 1) return 'Yesterday';
 return `${diffDays}d ago`;
 } catch {
 return 'Recently';
 }
}

export function maskUPI(upiId: string): string {
 if (!upiId || !upiId.includes('@')) return upiId;
 const [user, handle] = upiId.split('@');
 if (user.length <= 3) {
 return `${user[0]}***@${handle}`;
 }
 return `${user.slice(0, 2)}***${user.slice(-1)}@${handle}`;
}
