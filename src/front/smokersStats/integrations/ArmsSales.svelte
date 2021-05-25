<script>
    import react from 'react';
    import { JSCharting } from 'jscharting-react';

("chartDiv", {
  series: [
    {
      points: [{ x: "A", y: 10 }, { x: "B", y: 5 }]
    }
  ]
});

</script>

<main>
    
<div id="chartDiv" style="width: 100%; height: 400px;"></div>

</main>