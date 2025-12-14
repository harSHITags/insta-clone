import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function VerifyPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We sent a verification link to your email address. Click the link to verify your account and start using
              Instagram.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            {"Didn't receive the email? Check your spam folder or contact support."}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
