import math
from typing import List
from app.schemas.market_schemas import BatchPoolingCluster, PooledFarmer

class DBSCANBatchPooler:
    """
    Simulates spatio-temporal clustering of smallholders within a 15 km radius
    to aggregate 3 to 5 tonne commercial truck lots for reverse auction (e.g. to CAMPCO).
    """
    def find_or_create_cluster(self, lat: float, lng: float, crop: str = "Arecanut") -> BatchPoolingCluster:
        # Pre-clustered simulated neighbors in Belthangady / Ujire taluk
        neighbors = [
            PooledFarmer(id="FARMER-01", name="Manjunath G. (You)", quantity_quintals=14.0, distance_km=0.0),
            PooledFarmer(id="FARMER-02", name="Ramesh Bhat (Ujire)", quantity_quintals=12.5, distance_km=3.2),
            PooledFarmer(id="FARMER-03", name="Suresh Hegde (Dharmasthala)", quantity_quintals=11.5, distance_km=7.8),
        ]

        total_qtl = sum(f.quantity_quintals for f in neighbors)
        total_tonnes = round(total_qtl / 10.0, 2)

        return BatchPoolingCluster(
            cluster_id="CLUSTER-DK-BELTHANGADY-LOT-4",
            total_quantity_tonnes=total_tonnes,
            target_lot_tonnes=3.8,
            logistics_savings_pct=65.0,
            pooled_farmers=neighbors,
            status="READY_FOR_CAMPCO_AUCTION"
        )

batch_pooler = DBSCANBatchPooler()
