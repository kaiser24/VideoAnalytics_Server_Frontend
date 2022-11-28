import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JWTTokenService } from './jwt.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {
    constructor(  
        private router: Router, 
        private jwtService: JWTTokenService,
        private localstorage: LocalStorageService
    ) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
            
            this.jwtService.setToken(this.localstorage.get("token") as string);

            if (this.jwtService.getUser() || this.jwtService.getEmailId()) {
                if (this.jwtService.isTokenExpired()) {
                    this.router.navigate(['/login']);
                    return false;
                } else {
                    return true;
                }
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        }
}
