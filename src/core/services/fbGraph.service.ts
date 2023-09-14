import { Injectable } from '@nestjs/common';
import { HelperService } from '@core/services/helper.service';
import { rejects } from 'assert';
import * as graph from 'fbgraph';

@Injectable()
export class FbGraphService {
   constructor(private helperService: HelperService) {}

   async getProfile(
      accessToken: string,
      fields = 'id,name,email,picture.width(720).height(720)',
   ): Promise<{
      status: boolean;
      data?: { id: string; name: string; nameNon: string; email: string; picture: string };
   }> {
      return new Promise((resolve, reject) => {
         graph.get(`/me?fields=${fields}&access_token=${accessToken}`, function (err, res) {
            if (err) reject(err);
            resolve(res);
         });
      })
         .then((data) => {
            const fullNameNon = this.helperService.translateZoneNameVietnamese(data['name']);
            return {
               status: true,
               data: {
                  id: data['id'],
                  name: data['name'],
                  nameNon: fullNameNon,
                  email: data['email'],
                  picture: data['picture']?.data?.url,
               },
            };
         })
         .catch(() => {
            return { status: false };
         });
   }
}
