-- Demo catalog data. Auth users (admin, vets, suppliers) are created by scripts/seed-supabase.js,
-- because SQL Editor cannot safely create Supabase Auth password hashes.
insert into public.bulls (name,breed,registration_number,date_of_birth,milk_yield,butterfat_percent,protein_percent,calving_ease,fertility_index,tpi,scs,semen_price,stock_available,image_url) values
('Sir Lancelot','Holstein','H-12345','2020-01-15',35.5,4.2,3.4,9.5,1.2,2500,2.5,1500,100,'https://images.unsplash.com/photo-1546452285-05517173e614?q=80&w=2000&auto=format&fit=crop'),
('Mighty Taurus','Jersey','J-98765','2019-05-20',28,5.5,4,8,1,2200,2.8,1200,50,'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2000&auto=format&fit=crop'),
('Goliath','Friesian','F-55555','2021-03-10',32,3.9,3.2,10,1.5,2600,2.6,1350,75,'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2000&auto=format&fit=crop'),
('Red Ranger','Ayrshire','A-11111','2022-08-05',30.5,4.1,3.5,9,1.3,2400,2.7,1400,200,'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=2000&auto=format&fit=crop'),
('Thunder','Guernsey','G-22222','2020-11-30',29,4.8,3.8,8.5,1.1,2300,2.9,1300,150,'https://images.unsplash.com/photo-1588661660309-8d7ef2049e6b?q=80&w=2000&auto=format&fit=crop')
on conflict (registration_number) do nothing;
