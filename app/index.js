import $ from 'jquery'

class CardArea {
  state = { 
    cards: [
      { id: 1, front: 'Arrow Function', back: 'const name = (params) =>', show: 'front', prevState: 'front' },
      { id: 2, front: 'let', back: 'Replaces var can redefine', show: 'front', prevState: 'front' },
      { id: 3, front: 'const', back: 'Can\'t redifine or reassign', show: 'front', prevState: 'front' },
      { id: 4, front: 'Obj Destructure', back: '{ thing, thing2 } = obj', show: 'front', prevState: 'front' },
    ],
    editing: null,
  }

  app = null; 

  init = () => {
    $(document).on('click', '.flip', (e) => this.flip(e) ) 
    $(document).on('click', '.delete-card', (e) => this.deleteCard(e) ) 
    $(document).on('click', '.edit', (e) => this.editCard(e) ) 
    $(document).on('click', '#cancel', (e) => this.editCard(e) )
    $('#card_form').on('submit', (e) => this.handleSubmit(e) )
    this.app = $('#root')
    let grid = `
      <div id="grid" class="row">
      </div>
    `
    this.app.append(grid);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let { cards, editing } = this.state;
    let card = editing ? cards.find( c => c.id === editing ) : {}
    card.show = card.show || 'front' 
    let front = $('#front')
    let back = $('#back')
    card.front = front.val()
    card.back = back.val()
    if (editing) {
      this.state.cards = cards.map( c => {
        if (c.id === card.id) 
          return card
        return c
      })
    } else {
      card.id = this.findNextId()
      card.prevState = card.show
      this.state.cards.push(card)
    }

    this.state.editing = null

    this.state.cards.forEach( c => {
      c.prevState = c.show
    })

    this.buildGrid()
    front.val('')
    back.val('')
  }

  sort = (x,y) => {
    if (x.id > y.id)
      return 1
    if (x.id < y.id)
      return -1
    return 0
  }

  findNextId = () => {
    let ids = this.state.cards.sort().map( c => c.id )
    if (ids.length)
      return ids[ids.length - 1] + 1
    else 
      return 1
  }

  deleteCard = (e) => {
    const card = $(e.target).closest('.top')
    const id = card.data().id
    const { cards } = this.state;
    this.state.cards = cards.filter( c => c.id !== id )
    this.buildGrid()
  }

  editCard = (e) => {
    if ( this.state.editing ) {
      this.state.editing = false
      $('#front').val('')
      $('#back').val('')
    } else {
      const cardContainer = $(e.target).closest('.top')
      const id = cardContainer.data().id
      this.state.editing = id;
      const card = this.state.cards.find( c => c.id === id )
      $('#front').val(card.front)
      $('#back').val(card.back)
    }

    this.state.cards.forEach( c => {
      c.prevState = c.show
    });

    this.buildGrid()
  }

  flip = (e) => {
    const card = $(e.target).closest('.top')
    const id = card.data().id
    const { cards } = this.state;
    this.state.cards = cards.map( c => {
      if (c.id === id)
        return {
          ...c,
          show: c.show === 'front' ? 'back' : 'front',
          prevState: c.show
        }
        return {
          ...c,
          prevState: c.show
        }
    });

    this.buildGrid()
  }

  buildGrid = () => {
    if (this.state.editing) { 
      $('#cancel').remove()
      $('.form-submit').before('<button class="btn red" type="button" id="cancel">Cancel</button>')
      $('.form-submit').text('Update')
    } else {
      $('#cancel').remove()
      $('.form-submit').text('Add')
    }

    let grid = $('#grid')
    grid.empty()
    let cards = this.state.cards.map( card => { 
      let animate = ''
      let animateContent = ''
      if (card.prevState !== card.show) {
        animate = 'animate'
        animateContent = 'content-animate'
      }

      return `
        <div class="col s12 m4 top ${animate}" data-id=${card.id}>
          <div class="card blue-grey darken-1">
            <div class="card-content white-text ${animateContent}">
              <span class="card-title">${card[card.show]}</span>
            </div>
            <div class="card-action ${animateContent}">
              <button class="btn flip">Flip</button>
              <button class="btn edit blue">Edit</button>
              <button class="btn red delete-card">Delete</a>
            </div>
          </div>
        </div>
      `
    }) 

    cards.forEach( card => grid.append(card))
  }

}

$(document).ready( () => {
  const cardArea = new CardArea()
  cardArea.init()
  cardArea.buildGrid()
})
