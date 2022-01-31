import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JWTTokenService } from './jwt.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {
  constructor(  
    private router: Router, 
    private jwtService: JWTTokenService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (this.jwtService.getUser()) {
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
