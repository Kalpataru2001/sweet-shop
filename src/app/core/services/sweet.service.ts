import { Injectable } from '@angular/core';
import { Sweet } from '../models/sweet.interface';

@Injectable({
  providedIn: 'root'
})
export class SweetService {
  
  // This is your "Database" for now
  private sweets: Sweet[] = [
    {
      id: 1,
      name: 'Motichoor Ladoo',
      description: 'Tiny pearls of gram flour deep fried in pure ghee and soaked in sugar syrup.',
      price: 250,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Motichoor_Ladoo.jpg',
      tag: 'Best Seller'
    },
    {
      id: 2,
      name: 'Kaju Katli',
      description: 'Diamond-shaped cashew fudge topped with edible silver foil.',
      price: 800,
      imageUrl: 'https://www.cookwithmanali.com/wp-content/uploads/2016/10/Kaju-Katli-Recipe-1-500x500.jpg',
      tag: 'Premium'
    },
    {
      id: 3,
      name: 'Gulab Jamun',
      description: 'Soft dough balls soaked in rose-flavored sugar syrup.',
      price: 300,
      imageUrl: 'https://www.chefkunalkapur.com/wp-content/uploads/2021/09/Gulab-Jamun-scaled.jpeg?v=1631215712',
    },
    {
      id: 4,
      name: 'Rasgulla',
      description: 'Spongy cottage cheese balls cooked in light sugar syrup.',
      price: 280,
      imageUrl: 'https://static.toiimg.com/thumb/52743612.cms?imgsize=165883&width=800&height=800',
    },
    {
      id: 5,
      name: 'Mysore Pak',
      description: 'Traditional South Indian sweet made of ghee, sugar, and gram flour.',
      price: 450,
      imageUrl: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2020/01/mysore-pak-recipe.jpg',
      tag: 'Ghee Loaded'
    }
  ];

  constructor() { }

  // Method to get all sweets
  getSweets(): Sweet[] {
    return this.sweets;
  }

  // Method to get only Best Sellers (We can use this on Home Page later)
  getBestSellers(): Sweet[] {
    return this.sweets.filter(s => s.tag === 'Best Seller');
  }
}