import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { from } from 'rxjs';
import { CreateTeamCommand } from '@core-engine';

@Injectable({ providedIn: 'root' })
export class CreateTeamService {
  private readonly functions = inject(Functions);

  async createTeam(command: CreateTeamCommand): Promise<string> {
    const callable = httpsCallable<CreateTeamCommand, string>(this.functions, 'workspaces-createTeam');
    return from(callable(command)).toPromise().then((res) => res?.data ?? "");
  }
}
